import React from "react";
import { Typography, Card, Row, Col, List } from "antd";
import denrLogo from "../../../assets/images/denr.svg";

const { Title, Paragraph, Link, Text } = Typography;

function About() {
  const resources = [
    {
      title: "Environmental Management",
      url: "https://emb.gov.ph/services-2/",
      img: "https://emb.gov.ph/wp-content/uploads/2024/07/EMB-Logo-2.png",
    },
    {
      title: "Mines and Geosciences Bureau",
      url: "https://denr.gov.ph/products-services/frontline-services/biodiversity-management/",
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fecitesph.com%2Fweb%2Fimage%2F683%2FbmbDENRNewLogo.png&f=1&nofb=1&ipt=252953b1df412119c9edff7b6234b57eafb2df8bbe1548e37e559869752390df",
    },
    {
      title: "Forest Management Services",
      url: "https://forestry.denr.gov.ph/",
      img: "https://forestry.denr.gov.ph/fmb_web/wp-content/uploads/2024/07/Asset-1@denrfmb.png",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>About DENR</Title>

      <Paragraph>
        The{" "}
        <strong>Department of Environment and Natural Resources (DENR)</strong>{" "}
        is a government agency in the Philippines responsible for the
        conservation, management, development, and proper use of the country’s
        environment and natural resources. DENR plays a vital role in ensuring
        sustainable development while protecting the environment for present and
        future generations.
      </Paragraph>

      <Paragraph>
        <Text strong>Brief History:</Text> Established in 1978, DENR has been at
        the forefront of environmental protection and resource management in the
        Philippines. Over the years, DENR has adapted to the challenges of
        climate change, resource sustainability, and community empowerment.
      </Paragraph>

      {/* <Paragraph>
        <Text strong>Core Functions and Responsibilities:</Text>
      </Paragraph>
      <List
        size="small"
        bordered
        dataSource={[
          "Formulate policies and guidelines for environmental protection.",
          "Enforce laws related to natural resources and pollution control.",
          "Manage forest resources, wildlife, and mineral resources.",
          "Promote sustainable use of land, water, and marine resources.",
          "Conduct environmental impact assessments.",
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ marginBottom: 24 }}
      /> */}

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            cover={
              <img
                alt="DENR Banner"
                src={denrLogo}
                style={{ objectFit: "cover", width: "100%", height: 180 }}
                loading="lazy"
                decoding="async"
              />
            }
          >
            <Card.Meta
              title="DENR Official Website"
              description={
                <Link
                  href="https://www.denr.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit DENR Website
                </Link>
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            cover={
              <img
                alt="Environment Protection"
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                style={{ objectFit: "cover", height: 180, width: "100%" }}
                loading="lazy"
                decoding="async"
              />
            }
          >
            <Card.Meta
              title="About DENR Mission"
              description={
                <Link
                  href="https://denr.gov.ph/about-us/denr-mandate-mission-vision/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More About DENR's Mission and Vision
                </Link>
              }
            />
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Useful Resources
      </Title>

      <Row gutter={[16, 16]}>
        {resources.map(({ title, url, img }) => (
          <Col xs={24} sm={12} md={8} key={title}>
            <Card
              hoverable
              cover={
                <img
                  alt={title}
                  src={img}
                  style={{ objectFit: "cover", height: 140, width: "100%" }}
                  loading="lazy"
                  decoding="async"
                />
              }
            >
              <Card.Meta
                title={
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {title}
                  </Link>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default About;