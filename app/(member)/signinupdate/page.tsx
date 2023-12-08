'use client'
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';

import { member } from "@/app/_types/member"
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  generateWebAuthnLoginOptions,
  generateWebAuthnRegistrationOptions,
  verifyWebAuthnLogin,
  verifyWebAuthnRegistration,
} from "@/libraries/webauthn";


import * as formik from 'formik';
import * as yup from 'yup';

export default function Signin() {
  
  const { Formik } = formik;
  const router = useRouter();

  const validationSchema = yup.object().shape({
    email: yup.string()
      .email('Invalid email address')
      .required('Required')
  });

  return (
      <div>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: 'tyrannojung@korea.ac.kr',
          }}
          onSubmit={async (values, {setErrors, setSubmitting }) => {
            setSubmitting(true); // 비동기통신
            

          const response = await generateWebAuthnLoginOptions(values.email);
          if (!response.success || !response.data) {
            console.log(response.message ?? "Something went wrong!");
            return;
          }

          const localResponse = await startAuthentication(response.data);
          const verifyResponse = await verifyWebAuthnLogin(localResponse);
          
          if (!verifyResponse.success) {
            alert(verifyResponse.message ?? "Something went wrong!");
            return;
          }
          
          const response_value : member = response.user;
          const result = await signIn("credentials", {
            id: response_value.id,
            publicKey: response_value.publicKey,
            redirect: false,
          });
            console.log(result)


            if(result?.ok) {
               router.push('/');
               router.refresh();
            } else {
              // error 표시
              setErrors({
                email: ' ',
              });
            }

          }}
        >
          {({ handleSubmit, handleChange, values, touched, errors}) => (
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
                          <Form noValidate onSubmit={e => {
                            e.preventDefault();
                            handleSubmit(e)
                          }} autoComplete="off">
                            <Form.Group className="mb-3" controlId="ID">
                              <Form.Label className="text-center">
                                EMAIL
                              </Form.Label>
                            <Form.Control
                              type="text"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              isValid={touched.email && !errors.email}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
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
                            <div className="mt-3">
                              <p className="mb-0  text-center">
                                Don't have an account?{" "}
                                <a href="/signup" className="text-primary fw-bold">
                                  Sign Up
                                </a>
                              </p>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </Formik>
      </div>
  )
}
  