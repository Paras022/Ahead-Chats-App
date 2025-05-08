import { VStack , Input , InputGroup , InputRightElement , Button} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name , setName ] = useState();
  const [email , setEmail ] = useState();
  const [password , setPassword ] = useState();
  const [pic , setPic] = useState();
  const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) =>{

    };

    const submithandler = async() =>{
    if(!name || !email || !password){
      alert("enter all the details");
    }
    try{
      const config ={
        headers:{
          "content-type":"application/json",
        },
      };
      const{data} = await axios.post("http://localhost:8000/api/user",{name,email,password,pic},config);
      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats")
    }catch(error){
      alert(error.response.data.message);
    }

    }

  return (
    
    <VStack spacing={"5px"} >
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
        placeholder = 'Enter Your Name'
        onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
        placeholder = 'Enter Your Email'
        onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
     
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
        type={show ?"text":"password"}
        placeholder = 'Enter Your Password'
        onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>


      <FormControl id="pic">
        <FormLabel>Upload your profile pic</FormLabel>
        <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
      colorScheme="blue"
      width={"100%"}
      marginTop={15}
      
      onClick={submithandler}
      >
        Sign Up
      </Button>

    </VStack>
  );
};

export default Signup;
