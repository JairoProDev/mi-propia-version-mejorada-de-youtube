import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import MiTubeLogo from "../img/logo.png";
import useI18n from "../hooks/useI18n";

const Container = styled.div`
  flex: 1.5;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
`;
const ContainerWrapper = styled.div`
  height: 90%;
  overflow-y: scroll !important;
  margin-top: 16px;
`;
const Space = styled.div`
  height: 50px;
`;
const Logo = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 16px;
  padding: 16px 26px 0px 26px;
  font-size: 20px;
`;
const Image = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 26px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 15px 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div`
  padding: 0px 26px;
`;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 20px;
  padding: 0px 26px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { t } = useI18n();
  
  return (
    <Container>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Logo>
          <Image src={MiTubeLogo} />
          MiTube
        </Logo>
      </Link>
      <ContainerWrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <HomeIcon />
            {t('home')}
          </Item>
        </Link>
        <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <ExploreOutlinedIcon />
            {t('explore')}
          </Item>
        </Link>
        <Link
          to="subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <SubscriptionsOutlinedIcon />
            {t('subscriptions')}
          </Item>
        </Link>
        <Hr />
        <Item>
          <VideoLibraryOutlinedIcon />
          {t('library')}
        </Item>
        <Item>
          <HistoryOutlinedIcon />
          {t('history')}
        </Item>
        <Hr />
        {!currentUser && (
          <>
          <Login>
            {t('dontHaveAccount')}
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button>
                {" "}
                <AccountCircleOutlinedIcon />
                {t('signup')}
              </Button>
            </Link>
          </Login>
        <Hr />
        </>
        )}
        <Title>{t('bestOfMiTube')}</Title>
        <Item>
          <LibraryMusicOutlinedIcon />
          {t('music')}
        </Item>
        <Item>
          <SportsBasketballOutlinedIcon />
          {t('sports')}
        </Item>
        <Item>
          <SportsEsportsOutlinedIcon />
          {t('gaming')}
        </Item>
        <Item>
          <MovieOutlinedIcon />
          {t('movies')}
        </Item>
        <Item>
          <ArticleOutlinedIcon />
          {t('news')}
        </Item>
        <Item>
          <LiveTvOutlinedIcon />
          {t('live')}
        </Item>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          {t('settings')}
        </Item>
        <Item>
          <FlagOutlinedIcon />
          {t('report')}
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          {t('help')}
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? t('lightMode') : t('darkMode')}
        </Item>
        <Space />
      </ContainerWrapper>
    </Container>
  );
};

export default Menu;
