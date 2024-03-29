import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";


const Share = () => {
    const [file, setFile] = useState(null);
    const [desc, setDescription] = useState("");

    //code to upload file
    const upload = async () => {
        try {
            // need FormData to send to api
            const formData = new FormData();
            formData.append("file", file)
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err)
        }
    }

    const { currentUser } = useContext(AuthContext);

    // to refetch data
    const queryClient = useQueryClient();

    // using mutation to make api request
    const mutation = useMutation((newPost) => {
        // end point is /posts and we will be sending desc & img
        return makeRequest.post("/posts", newPost);
    },
        {
            onSuccess: () => {
                // invalidate and refetch
                queryClient.invalidateQueries(["posts"]);
            },
        }
    );

    const handleClick = async (e) => {
        e.preventDefault();
        let imgUrl = "";
        if (file) imgUrl = await upload();
        mutation.mutate({ desc, img: imgUrl });
        setDescription("");
        setFile(null);
    };

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={"/upload/"+ currentUser.profilePic} alt="" />
                        <input type="text"
                            placeholder={`What's on your mind ${currentUser.name}?`} onChange={(e) => setDescription(e.target.value)}
                            value={desc}
                        />
                    </div>
                    <div className="right">
                        {/* this is to show the image use has uploaded */}
                        {file && <img className="file" alt="" src={URL.createObjectURL(file)}/>}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input
                            type="file"
                            id="file"
                            style={{ display: "none" }}
                            // files[0] = uploading a single file
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {/* adding a file from user computer */}
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Add Image</span>
                            </div>
                        </label>
                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Add Place</span>
                        </div>
                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Tag Friends</span>
                        </div>
                    </div>
                    <div className="right">
                        <button
                            onClick={handleClick}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Share;
