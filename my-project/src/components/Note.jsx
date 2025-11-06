import React from "react";




function Note(props){
    return(
        <div className="flex p-4 shadow-lg rounded-xl w-[280px] h-[100px] bg-[#FAEAB1] border border-gray-400">
        <div className="justify-center items-center">
            <h2>{props.title}</h2>
            <p>{props.content}</p>
        </div>
        </div>
    );
}

export default Note;