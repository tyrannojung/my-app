'use client'
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';
import {useState} from "react";

export default function Signup() {
  const [value, setValue] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setValue(value);
    console.log(value)
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
                        <Form.Group className="mb-3" controlId="Name">
                          <Form.Label className="text-center">
                            Name
                          </Form.Label>
                          <Form.Control type="text" placeholder="Enter Name" onChange={handleChange} value={value} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="text-center">
                            Email address
                          </Form.Label>
                          <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
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
  