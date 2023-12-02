'use client'
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';
import {useState} from "react";
import { member } from "@/app/_types/member"

export default function Signup() {
  
  //  id useState
  const [idValue, setIdValue] = useState("tyrannojung");
  const [nameValue, setNameValue] = useState("dawoon jung");
  const [pbkValue, setPbkValue] = useState("0x84207aCCB87EC578Bef5f836aeC875979C1ABA85");
  const [emailValue, setEmailValue] = useState("tyrannojung@korea.ac.kr");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(idValue, nameValue, pbkValue, emailValue);
    
    const member_info : member = {
        id : idValue,
        publicKey : pbkValue,
        email : emailValue,
        name : nameValue,
        updatedAt : null,
        createAt : new Date()
    } 
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(member_info)
  }
   
  const resp = await fetch('/api/member/signup/', options);
    const data = await resp.json()
    if(data.result == "success") {
      console.log('어디론가 이동');
    }

  };

  const idChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setIdValue(value);
    
  }

  const nameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNameValue(value);
    
  }

  const pbkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setPbkValue(value);
    
  }

  const emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setEmailValue(value);
    
  }

  return (
      <div>
        <Container>
          <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col md={8} lg={6} xs={12}>
            <div className="border border-2 border-primary"></div>
              <Card className="shadow px-4">
                <Card.Body>
                  <div className="mb-3 mt-md-4">
                    <h2 className="fw-bold mb-2 text-center text-uppercase ">
                      <Image src={TOKAMAK_ICON} alt="" className="middle_logo" />
                    </h2>
                    <div className="mb-3">
                      <Form  onSubmit={onSubmit}>
                        
                        <Form.Group className="mb-3" controlId="ID">
                          <Form.Label className="text-center">
                            ID
                          </Form.Label>
                          <Form.Control type="text" placeholder="Enter ID" onChange={idChange} value={idValue} />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="text-center">
                            Name
                          </Form.Label>
                          <Form.Control type="text" placeholder="Enter Name" onChange={nameChange} value={nameValue} />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicPublicKey">
                          <Form.Label className="text-center">
                            Public Key
                          </Form.Label>
                          <Form.Control type="text" placeholder="Enter publicKey" onChange={pbkChange} value={pbkValue}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="text-center">
                            Email address
                          </Form.Label>
                          <Form.Control type="email" placeholder="Enter email" onChange={emailChange} value={emailValue}/>
                        </Form.Group>

                        <div className="d-grid">
                          <Button variant="primary" type="submit">
                            Create Account
                          </Button>
                        </div>

                      </Form>
                      <div className="mt-3">
                        <p className="mb-0  text-center">
                        Already have an account??{" "}
                          <a href="{''}" className="text-primary fw-bold">
                            Sign In
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  