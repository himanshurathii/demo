import React from 'react'
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const PipelineConnection = ({ x1, y1, x2, y2 }) => {
    // console.log("Mounted");
    const curvedHorizontal = function (x1, y1, x2, y2) {
        let line = [];
        let mx = x1 + (x2 - x1) / 2;

        line.push("M", x1, y1);
        line.push("C", mx, y1, mx, y2, x2, y2);

        return line.join(" ");
    };
    const [d, setD] = useState("");
    useEffect(() => {
        setD(curvedHorizontal(x1, y1, x2, y2));
    }, [x1, y1, x2, y2]);
    return (
        <Box
            className="pipeline-connection"
            height="100%"
            width="100%"
            position="absolute"
            top={0}
            left={0}
        >
            <svg style={{ height: "100%", width: "100%", position: "inherit" }}>
                <defs>
                    <marker
                        id="pipeline-connection-arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="8"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 8 3.5, 0 7" />
                    </marker>
                </defs>
                <path
                    stroke="black"
                    stroke-width="2"
                    fill="none"
                    d={d}
                    marker-end="url(#pipeline-connection-arrowhead)"
                ></path>

                {/* <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="dodgerblue" /> */}
            </svg>
        </Box>
    );
};

export default PipelineConnection;
