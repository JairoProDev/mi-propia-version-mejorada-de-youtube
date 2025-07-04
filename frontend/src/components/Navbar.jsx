import React from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import LanguageSelector from "./LanguageSelector";

const Container = styled.div`
  position: sticky;
  top: 0;
  height: 56px;
  background-color: ${({ theme }) => theme.bgLighter};
  z-index: 100;
`;
const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 40px;
  position: relative;
`;
const Search = styled.div`
  width: 50%;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.soft2};
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.soft2};
`;
const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 16px;
  padding: 10px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.bgDark};
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" />
          <SearchIcon style={{ marginRight: "12px", marginLeft: "12px" }} />
        </Search>

        <RightSection>
          <LanguageSelector />
          
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon  />
              <Avatar src={currentUser.img} />
            </User>
          ) : (
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon /> Sign Up
              </Button>
            </Link>
          )}
        </RightSection>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
