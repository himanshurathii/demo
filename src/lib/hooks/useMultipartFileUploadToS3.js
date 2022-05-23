import React from "react";
import axios from "axios";
import mime from "mime-types";

// max file size in 48.83 GB
const MAX_FILE_SIZE = 52428800000;

export default function useMultipartFileUploadToS3({
  startUploadCallback = () => {},
  fetchPresignedUrlForEachChunk = async () => {},
  onCompleteMultipartUpload = () => {},
}) {

  const [fileType, setFileType] = React.useState("");
  const [progress, setProgress] = React.useState(0);

  // ===============================================
  // The startUpload function obtains an uploadId generated in the backend
  // server by the AWS S3 SDK. This uploadId will be used subsequently for uploading
  // the individual chunks of the selectedFile.
  // ===============================================
  const startUpload = (fileToUpload, progressCallback = (progress) => {}, fileUploadDoneCallback = (resp) => {}) => {
    setProgress(0);
    progressCallback(0);
    if (fileToUpload.size <= MAX_FILE_SIZE) {
      // setFile(fileToUpload);
      // setFileType(fileToUpload.type);
      let fType = "";
      if (!fileToUpload.type) {
        //https://stackoverflow.com/questions/51724649/mime-type-of-file-returning-empty-in-javascript-on-some-machines
        fType = mime.lookup(fileToUpload.name);
        setFileType(fType);
      }
      startUploadCallback(
        {
          fileName: fileToUpload.name,
          fileType: fType, // state updates are async so cant use fileType from state here.
        },
        (resp) => {
          let { uploadId } = resp.data;
          //setUploadId(uploadId);
          // Reason for passing fileSize as param from here is state updates are taking time, so file.size is comming undefined.
          uploadParts(fileToUpload, fType, uploadId, progressCallback, fileUploadDoneCallback);
        },
        () => {}
      );
    } else {
      throw "File size is too large. Max file size supported is 48.83 GB.";
    }
  };

  // ===============================================
  // The uploadParts function splits the selectedFile into chunks
  // of 10MB and does the following:
  // (1) call the backend server for a presigned url for each part,
  // (2) uploads them, and
  // (3) upon completion of all responses, sends a completeMultipartUpload call to the backend server.
  //
  // Note: the AWS SDK can only split one file into 10,000 separate uploads.
  // This means that, each uploaded part being 10MB, each file has a max size of
  // 100GB.
  // Also AWS support max upload upto 5TB only.
  // So if you want to upload that large file chunk size should be 500mb
  // 1TB = 100MB
  // ===============================================

  const uploadParts = async (file, fType, uploadId, progressCallback = (progress) => {}, fileUploadDoneCallback = (resp) => {}) => {
    console.log("Inside uploadMultipartFile");
    // https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html
    // minimun chunk size should be 5MB
    const FILE_CHUNK_SIZE = 5242880; // 5MB 
    const NUM_CHUNKS = Math.floor(file.size / FILE_CHUNK_SIZE) + 1;
    let promisesArray = [];
    let start, end, blob;

    for (let index = 1; index < NUM_CHUNKS + 1; index++) {
      start = (index - 1) * FILE_CHUNK_SIZE;
      end = index * FILE_CHUNK_SIZE;
      blob = index < NUM_CHUNKS ? file.slice(start, end) : file.slice(start);

      // (1) Generate presigned URL for each part
      let getUploadUrlResp = await fetchPresignedUrlForEachChunk({
        fileName: file.name,
        partNumber: index,
        uploadId: uploadId,
      });

      let { presignedUrl } = getUploadUrlResp.data;

      // (2) Puts each file part into the storage server
      let uploadResp = axios
        .put(presignedUrl, blob, {
          headers: { "Content-Type": fType },
        })
        .then(
          (resp) => {

            setProgress((old) => {
              // state updates are async so progress may not update in sequence.
              // hence adding check
              const p = (index / NUM_CHUNKS) * 100;
              const newState = old > p ? old : p;
              progressCallback(newState)
              return newState;
            });
            // console.log(
            //   "   Upload no " + index + "; Etag: " + uploadResp.headers.etag
            // );
            return resp;
          },
          (err) => err
        );
      promisesArray.push(uploadResp);
    }

    let resolvedArray = await Promise.all(promisesArray);
    let uploadPartsArray = [];
    resolvedArray.forEach((resolvedPromise, index) => {
      uploadPartsArray.push({
        ETag: resolvedPromise.headers.etag,
        PartNumber: index + 1,
      });
    });

    // (3) Calls the CompleteMultipartUpload endpoint in the backend server
    onCompleteMultipartUpload(
      {
        fileName: file.name,
        parts: uploadPartsArray,
        uploadId: uploadId,
      },
      fileUploadDoneCallback,
      (err) => {}
    );
  };

  return {
    startUpload,
    progress,
    fileType,
  };
}
