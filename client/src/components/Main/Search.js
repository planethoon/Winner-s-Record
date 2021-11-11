import axios from "axios";
import { useEffect, useState } from "react";

import TypeSelector from "./TypeSelector";
import GameSelector from "./GameSelector";
import OptionSelector from "./OptionSelector";
import SearchBar from "./SearchBar";

const Search = ({ setPostList, searchOption, setSearchOption }) => {
  useEffect(() => {
    searchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchHandler = () => {
    if (!searchOption.input) {
      setSearchOption({ ...searchOption, input: "all" });
    }
    const { postType, game, option, input } = searchOption;

    axios
      .get(
        `http://server.winner-s-record.link/doc?type=${postType}&event=${game}&${option}=${input}&page=0`
      )
      .then((res) => {
        if (res.status === 404) {
        } else {
          const sorted = res.data.data;
          setPostList(sorted);
        }
      })
      .catch((err) => {
        console.error("에러 발생", err);
        setPostList([]);
      });
  };

  return (
    <div className="search--container">
      <div className="wrapper">
        <GameSelector
          setSearchOption={setSearchOption}
          searchOption={searchOption}
        />
        <OptionSelector
          setSearchOption={setSearchOption}
          searchOption={searchOption}
        />
        <SearchBar
          searchHandler={searchHandler}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
        />
      </div>

      <TypeSelector
        setSearchOption={setSearchOption}
        searchOption={searchOption}
        setPostList={setPostList}
      />
    </div>
  );
};

export default Search;
