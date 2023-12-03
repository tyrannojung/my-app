'use client'
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';

import {useState} from "react";
import { member } from "@/app/_types/member"
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'

export default function Signin() {
  
  const router = useRouter();
  const [idValue, setIdValue] = useState("tyrannojung");
  const [pbkValue, setPbkValue] = useState("0x84207aCCB87EC578Bef5f836aeC875979C1ABA85");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const member_info : member = {
        id : idValue,
        publicKey : pbkValue
    } 

  //   const options = {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(member_info)
  // }
   
  // const resp = await fetch('/api/member/signin/', options);
  // const data = await resp.json()
  // if(data.result == "success") {
  //     router.push('/');
  //     router.refresh();
  // }

    const result = await signIn("credentials", {
      id: member_info.id,
      publicKey: member_info.publicKey,
      redirect: true,
      callbackUrl: "/",
    });

    console.log(result);


  };

  const idChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setIdValue(value);
    
  }

  const pbkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setPbkValue(value);
    
  }

    return (
      <div>
        <Container>
          <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col md={8} lg={6} xs={12}>
              <div className="border border-3 border-primary"></div>
              <Card className="shadow">
                <Card.Body>
                  <div className="mb-3 mt-md-4">
                    <h2 className="fw-bold mb-2 text-center text-uppercase ">
                      <Image src={TOKAMAK_ICON} alt="" className="middle_logo" />
                    </h2>
                    <p className=" mb-5">Please enter your login and password!</p>
                    <div className="mb-3">
                      <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="ID">
                          <Form.Label className="text-center">
                            ID
                          </Form.Label>
                          <Form.Control type="text" placeholder="Enter ID" onChange={idChange} value={idValue} />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPublicKey"
                        >
                          <Form.Label>Public Key</Form.Label>
                          <Form.Control type="text" placeholder="Enter publicKey" onChange={pbkChange} value={pbkValue} />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <p className="small">
                            <a className="text-primary" href="#!">
                              Forgot password?
                            </a>
                          </p>
                        </Form.Group>
                        <div className="d-grid">
                          <Button variant="primary" type="submit">
                            Login
                          </Button>
                        </div>
                      </Form>
                      <div className="mt-3">
                        <p className="mb-0  text-center">
                          Don't have an account?{" "}
                          <a href="/signup" className="text-primary fw-bold">
                            Sign Up
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
  