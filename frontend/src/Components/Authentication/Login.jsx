import { VStack , Input , InputGroup , InputRightElement , Button} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
const Login = () => {
  
    const {url} = ChatState();
      const [show, setShow] = useState(false);
      
      const [email , setEmail ] = useState();
      const [password , setPassword ] = useState();
      const navigate = useNavigate();
    
        const handleClick = () => setShow(!show);
    
       
    
        const submithandler = async () =>{
          if(!email || !password){
            alert("enter all the details");
          }

           try{
                const config ={
                  headers:{
                    "content-type":"application/json",
                  },
                };
                const{data} = await axios.post(`${url}/api/user/login`,{email,password},config);
                localStorage.setItem("userInfo",JSON.stringify(data));
                
                navigate("/chats")
              }catch(error){
                alert(error.response.data.message);
              }
        }
    
      return (
        
        <VStack spacing={"5px"} >
          
    
          <FormControl id="loginemail" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            placeholder = 'Enter Your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
         
          <FormControl id="loginpassword" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
            type={show ?"text":"password"}
            placeholder = 'Enter Your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
          </FormControl>
    
    
        
    
          <Button
          colorScheme="blue"
          width={"100%"}
          marginTop={15}
          
          onClick={submithandler}
          >
            Login
          </Button>
          <Button
          variant={"solid"}
          colorScheme="red"
          width={"100%"}
          marginTop={15}
          onClick={() => {
            setEmail("guest@example.com")
            setPassword("123456");
          }}
          >
            Get Guest Credentials
          </Button>
        </VStack>
  )
}

export default Login