import React, { Component } from "react";
import Dropzone from "react-dropzone";
import filesize from "filesize";
import uploadIcon from "../images/upload_file.png";
const Photos = props => {
  return (
    <div>
      <div>
        <Dropzone
          className="file-upload-area"
          onDrop={files => props.onDrop(files)}
        >
          <div className="space" />

          <div>
            <h1>Drop photos here</h1>
          </div>
          <div className="space" />
          <h1 className="photoText">Add up to 50 photos of your property</h1>
          <hr className="hr" />

          <div>
            {" "}
            <div className="btn btn-plain btn-file-uploader">
              <button className="btn-upload">Select Photos to upload</button>
            </div>
          </div>
          <div>
            {" "}
            <p className="">
              You can choose to upload more than one photo at a time.
            </p>
          </div>
        </Dropzone>
        {props.isUploaded && (
          <table className="table-upload">
            <tbody className="table-upload-body">
              {props.photos.map(data => (
                <tr
                  key={props.photos.indexOf(data)}
                  className="table-upload-row"
                >
                  <td className="table-upload-row-preview">
                    <img
                      className="preview-image"
                      src={
                        data[0].type === "application/pdf"
                          ? uploadIcon
                          : URL.createObjectURL(data[0])
                      }
                      alt=""
                    />
                  </td>
                  <td className="table-upload-row-name">
                    <span>{data[0].name}</span>
                  </td>
                  <td className="table-upload-row-size">
                    {filesize(data[0].size)}
                  </td>
                  <td className="table-upload-row-delete">
                    <button
                      value={data[0].name}
                      className="btn btn-danger btn-small"
                      onClick={event => {
                        props.clicked(event, data[0].name);
                      }}
                    >
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Photos;
