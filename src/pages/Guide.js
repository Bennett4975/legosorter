import React from "react";
import "../styles/Guide.css"

const Guide = () => {
    return (
        <div className="guide-container">
            <h2>Welcome to my LEGO building app</h2>
            <p>Short introductory and guide on how to go about using the app</p>
            <h3>What is this?</h3>
            <p>This is an application to help you to sort your mixed up LEGO peices into their 
                original sets.
            </p>
            <h3>What do I do?</h3>
            <h5>Step 1:</h5>
            <p>Go to "Search Set" and add every set you know that you own.
                I would advise doing this searching the set number of each instruction manual you have.
                Otherwise, it's up to your own memory
            </p>
            <h5>Step 2:</h5>
            <p>Now that your sets are logged, you must piece by piece log a lego part by using "Search Part"
                and selecting it's color. All owned sets that reqiure or contain that piece be displayed.
                You can choose which set you would like to contribute that piece to. If no sets require the piece,
                you may discard it.
            </p>
            <h5>Step 3:</h5>
            <p>Repeat Step 2 until you no longer have any more pieces or until all sets are complete!</p>

            <h5>Tips for efficiency:</h5>
            <p>This clearly sounds like a tedious task (it very much is), but having field tested this myself, I have 
                some tips that can make the process more efficient.
            </p>
            <h6>1: Start with larger chunks that are still connected together:</h6>
            <p>As your going through the LEGO "graveyard", you may find chunks parts that clearly all go to the 
                same set. Each set has it's own page that displays all needed and owned parts which you may 
                add and remove as you please.
            </p>
            <p>If it is not initially clear which set the chunk is a part of, I would advise searching for the
                most unusual part. From there you can see if any set requires the part, and make an educated guess
                if the set requires two or three more of the chunks parts.
            </p>
            
        </div>
    );
};

export default Guide;