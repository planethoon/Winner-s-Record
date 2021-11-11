import { useState } from "react";
import { useHistory } from "react-router";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import axios from "axios";
import CreateCompleteModal from "../components/CreateDoc/CreateCompleteModal";
import EventSelector from "../components/CreateDoc/EventSelector";
import ChooseMap from "../components/CreateDoc/ChooseMap";
dotenv.config();

export default function CreateDoc() {
  const history = useHistory();
  const [preview, setPreview] = useState([]);
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [type, setType] = useState(null);
  const [docId, setDocId] = useState(null);

  const openModalHandler = () => {
    setIsModalOpen(!isModalOpen);
  };

  const imgOnchange = (e) => {
    const imageFiles = Array.from(e.target.files);
    setFiles(imageFiles);
    const previewArr = [];
    for (let imageFile of imageFiles) {
      const data = [];
      data.push(imageFile);
      const imageURL = window.URL.createObjectURL(
        new Blob(data, { type: "image" })
      );
      previewArr.push(imageURL);
    }
    setPreview(previewArr);
  };

  const [inputValue, setInputValue] = useState({
    title: "",
    place:
      "37.5161996814031|127.075939572603|서울 송파구 올림픽로 25|서울종합운동장|서울 송파구 잠실동",
    price: "",
    text: "",
    img: [],
  });

  const handleInputValue = (key) => (e) => {
    setInputValue({ ...inputValue, [key]: e.target.value });
  };

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
    region: process.env.REACT_APP_REGION,
  });

  const uploadFiles = async (fileArr) => {
    const pathArr = [];
    for (let file of fileArr) {
      const params = {
        ACL: "public-read",
        Body: file,
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: file.name,
        ContentType: "image",
      };
      await myBucket
        .putObject(params)
        .promise()
        .then((res) => {
          const path = `${process.env.REACT_APP_BUCKET_URL}${res.$response.request.httpRequest.path}`;
          pathArr.push(path);
        });
    }
    handleSubmit(pathArr);
  };

  const handleSubmit = (arr) => {
    const { title, place, price, text } = inputValue;
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://server.winner-s-record.link/doc",
        { type, title, event, place, price, text, img: arr },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setDocId(res.data.data.docId);
        openModalHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isValid = (type) => {
    if (type === "match")
      return event && type && inputValue.title && inputValue.text;
    if (type === "trade")
      return (
        event && type && inputValue.title && inputValue.text && inputValue.price
      );
  };

  return (
    <div>
      <div>
        <EventSelector setEvent={setEvent} />
      </div>
      <div>
        <input
          type="title"
          onChange={handleInputValue("title")}
          placeholder="제목"
        />
        <input
          type="text"
          onChange={handleInputValue("text")}
          placeholder="본문"
        />
        <input type="file" multiple onChange={imgOnchange} />
        <ul>
          {preview.length ? (
            preview.map((e, index) => {
              return (
                <li key={index}>
                  <img src={e} alt="preview" />
                  <div
                    onClick={() => {
                      setPreview(
                        preview.filter((e) => preview.indexOf(e) !== index)
                      );
                      setFiles(files.filter((e) => files.indexOf(e) !== index));
                    }}
                  >
                    삭제
                  </div>
                </li>
              );
            })
          ) : (
            <div>미리보기가 없습니다.</div>
          )}
        </ul>
      </div>
      <ChooseMap inputValue={inputValue} setInputValue={setInputValue} />
      <button
        onClick={() => {
          history.push("/main");
        }}
      >
        돌아가기
      </button>
      {isValid(type) ? (
        <button
          style={{ color: "green" }}
          onClick={() => {
            uploadFiles(files);
          }}
        >
          작성하기
        </button>
      ) : (
        <button> 작성하기</button>
      )}
      <CreateCompleteModal isModalOpen={isModalOpen} docId={docId} />
    </div>
  );
}
