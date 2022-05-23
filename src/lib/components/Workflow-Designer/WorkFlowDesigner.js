import React from "react";
import { useRef, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import PipelineStep from "./PipelineStep";
import PipelineConnection from "./PipelineConnection";

const useStyles = makeStyles((theme) => ({
    noPointerEvents: {
        pointerEvents: "none",
    },
}));

function WorkFlowDesigner(props) {
    // pipeline
    const classes = useStyles();
    const [offsets, setOffsets] = useState({});
    const pipeLineContainerRef = useRef(null);

    const [connection, setConnection] = useState({
        active: false,
        startNode: undefined,
        x1: 0,
        y1: 0,
        x2: -1,
        y2: -1,
    });

    // get Offset position of pipeline steps container
    useEffect(() => {
        const coords = pipeLineContainerRef.current.getBoundingClientRect();
        setOffsets({ x: coords.x, y: coords.y });
        console.log("offset pos for pipeline container", coords);
    }, []);

    const resolveOffsets = (pos) => {
        // this function subtracts the offsets from mouse pointer position
        // as container might not be at top:0 left:0 position always so this function
        // subtracts the space btw page top and container top and same for left side
        // return { x: pos.x - offsets.x, y: pos.y - offsets.y };
        console.log("Updating Offsets");
        const coords = pipeLineContainerRef.current.getBoundingClientRect();
        // setOffsets({ x: coords.x, y: coords.y });
        return { x: pos.x - coords.x, y: pos.y - coords.y };
    };

    const connectionStart = (outgoingNode, pos) => {
        pos = resolveOffsets(pos);
        // createConnection(outgoingNode, undefined);
        console.log("received start position", pos);
        setConnection({
            x1: pos.x,
            y1: pos.y,
            x2: pos.x,
            y2: pos.y,
            startNode: outgoingNode,
            active: true,
        });
        console.log("This is start of connection");

        // setting connection state active
        setConnection((prev) => ({
            ...prev,
            active: true,
        }));
    };

    // connection checks
    const checkDuplicateConnection = (conn) => {
        return props.designerState.connections.some(
            (val) =>
                val.startNode === conn.startNode && val.endNode === conn.endNode
        );
    };

    const checkSelfConnection = (conn) => {
        return conn.startNode === conn.endNode;
    };

    const connectionComplete = (endNode) => {
        // this function adds the completed connection to the main state
        if (connection.active) {
            let isValid = true;
            let newConnection = {
                ...connection,
                id: `${props.designerState.connections.length + 1}c`,
                endNode: endNode,
            };
            if (checkDuplicateConnection(newConnection)) {
                isValid = false;
                alert("Duplicate Connections are not allowed");
            } else if (checkSelfConnection(newConnection)) {
                isValid = false;
                alert("Self Connections are not allowed");
            }

            if (isValid) {
                console.log("adding new connection");
                props.onAddConnection(newConnection);
            }
        }
    };

    const updateConnectionsOnStepMove = (id, incomingPos, outgoingPos) => {
        // console.log('Before Offsets', incomingPos, outgoingPos);
        incomingPos = resolveOffsets(incomingPos);
        outgoingPos = resolveOffsets(outgoingPos);
        // console.log('After Offsets', incomingPos, outgoingPos);
        let newConnections = props.designerState.connections.map((value) => {
            let val = Object.assign({}, value);

            if (val.startNode === id) {
                val.x1 = outgoingPos.x;
                val.y1 = outgoingPos.y;
            } else if (val.endNode === id) {
                val.x2 = incomingPos.x;
                val.y2 = incomingPos.y;
            }

            return val;
        });

        props.onUpdateConnections(newConnections);
    };

    const updateStepPosition = (id, newPos) => {
        newPos = resolveOffsets(newPos);

        let newSteps = props.designerState.steps.map((value) => {
            let val = Object.assign({}, value);
            if (val.id === id) val.pos = newPos;

            return val;
        });
        props.onUpdateStepPos(newSteps);
    };

    const onPipelineStepsContainerDown = (e) => {
        // this function tracks the mouse movement on the container
        // console.log("Pipe Holder: Mouse Down", e.clientX, e.clientY);

        // disabling active state of connection on click
        if (connection.active)
            setConnection((prev) => ({
                ...prev,
                active: false,
            }));
    };

    const onPipelineStepsContainerMove = (e) => {
        let pos = resolveOffsets({ x: e.clientX, y: e.clientY });

        if (connection.active) {
            setConnection((prev) => ({
                ...prev,
                x2: pos.x,
                y2: pos.y,
            }));
        }
    };

    const onPipelineStepsContainerUp = (e) => {
        console.log("Pipe Holder: Mouse Up", e.clientX, e.clientY);
        // setConnection((prev) => ({ ...prev, active: false }));
    };

    const stepComponents = props.designerState.steps.map((step, index) => {
        return (
            <PipelineStep
                key={index}
                title={step.title}
                id={step.id}
                pos={step.pos}
                icon={step.icon}
                onConnStart={connectionStart}
                onConnEnd={connectionComplete}
                onStepDrag={updateConnectionsOnStepMove}
                onUpdateStepPos={updateStepPosition}
                readOnly={props.readOnly ? props.readOnly : false}
                displayComponent={props.stepComponent}
            />
        );
    });

    const connectionComponents = props.designerState.connections.map(
        (connection, index) => {
            return <PipelineConnection key={index} {...connection} />;
        }
    );

    const addNewStep = () => {
        let stepName = prompt(
            "Enter Step name",
            `Step ${props.designerState.steps.length + 1}`
        );
        let newStep = {
            id: `${props.designerState.steps.length + 1}s`,
            title: stepName,
            pos: {
                x: 0,
                y: 0,
            },
        };
        props.onAddStep(newStep);
    };

    return (
        <div className="workflow-designer">
            {!props.readOnly && (
                <Box
                    className="pipeline-actions"
                    display="flex"
                    justifyContent="center"
                    my={1}
                >
                    <Button
                        variant="contained"
                        onClick={addNewStep}
                        color="primary"
                    >
                        Add Step
                    </Button>
                </Box>
            )}
            <Box
                className="pipeline-view"
                position="relative"
                height={500}
                bgcolor="rgba(128, 128, 128, 0.082)"
                overflow="hidden"
                ref={pipeLineContainerRef}
                onMouseDown={onPipelineStepsContainerDown}
                onMouseMove={onPipelineStepsContainerMove}
                onMouseUp={onPipelineStepsContainerUp}
            >
                <Box className="steps">{stepComponents}</Box>
                <Box
                    className={["connections", classes.noPointerEvents]}
                    zIndex={10}
                    position="absolute"
                    top={0}
                    left={0}
                    height="100%"
                    width="100%"
                >
                    {connectionComponents}
                    {connection.active && (
                        <PipelineConnection
                            x1={connection.x1}
                            y1={connection.y1}
                            x2={connection.x2}
                            y2={connection.y2}
                        />
                    )}
                </Box>
            </Box>
        </div>
    );
}

export default WorkFlowDesigner;
