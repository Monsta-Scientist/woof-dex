import React from 'react';
import { Layout, Row, Col, Grid } from 'antd';
import Link from './Link';
import { helpUrls } from './HelpUrls';
const { Footer } = Layout;
const { useBreakpoint } = Grid;

const footerElements = [
  { description: 'Discord', link: helpUrls.discord },
  { description: 'Telegram', link: helpUrls.telegram },
  { description: 'Twitter', link: helpUrls.twitter },
  { description: 'GitHub', link: helpUrls.github },
  { description: 'Website', link: helpUrls.website },
  { description: 'Shop', link: helpUrls.shop },
  {
    description: 'Education',
    link: helpUrls.educationResources,
  }
];

export const CustomFooter = () => {
  const smallScreen = !useBreakpoint().lg;

  return (
    <Footer
      style={{
        height: '45px',
        paddingBottom: 10,
        paddingTop: 10,
        background: 'transparent',
      }}
    >
      <Row align="middle" gutter={[32, 4]}>
        {!smallScreen && (
          <>
            <Col flex="auto" />
            {footerElements.map((elem, index) => {
              return (
                <Col key={index + ''}>
                  <Link external to={elem.link}>
                    {elem.description}
                  </Link>
                </Col>
              );
            })}
          </>
        )}
        <Col flex="auto">{/*  <DexProgramSelector />*/}</Col>
      </Row>
    </Footer>
  );
};
