import React from 'react'
import HomeStyled from "./Home.styles.jsx";
import {Button, Flex, Image, Typography} from "antd";
import denrLogo from '../../assets/images/denr.svg'
import {Link} from "react-router-dom";

const {Text} = Typography;

function Home() {
  return (
    <HomeStyled>
      <Image src={denrLogo} preview={false}/>
      <Flex vertical justify='center' align='center'gap='middle'>
        <Text className='ph-text'>Republic of the Philippines</Text>
        <Text className='denr-cenro-text'>DENR CENRO ONLINE APPLICATION AND DOCUMENT TRACKING SYSTEM</Text>
        <Text className='other-text'>ENVIRONMENTAL MANAGEMENT BUREU</Text>
        <Text className='other-text'>DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES</Text>
        <Button type='primary' className='continue-btn'><Link to='/signin'>Continue</Link></Button>
      </Flex>
    </HomeStyled>
  )
}

export default Home
