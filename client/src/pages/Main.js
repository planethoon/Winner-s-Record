import { useState } from "react";

import Search from "../components/Main/Search";
import PostList from "../components/Main/PostList";
import TopButton from "../components/TopButton";
import NoPost from "../components/Main/NoPost";
import NeedLoginModal from "../components/NeedLoginModal";

const Main = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [postList, setPostList] = useState([]);

  return (
    <div className={"main--container"}>
      <Search setPostList={setPostList} />
      MainPage
      {postList.length ? (
        <PostList postList={postList} />
      ) : (
        <NoPost setLoginModal={setLoginModal} />
      )}
      <TopButton />
      <NeedLoginModal isModalOpen={loginModal} setIsModalOpen={setLoginModal} />
    </div>
  );
};

export default Main;
