'use client'
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';

import { member } from "@/app/_types/member"
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'
import { UserOperation } from "permissionless";
import { bundlerSign } from "@/app/(member)/signinupdate/_webauthn/bundlerTool";

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

import base64url from 'base64url';
import { decodeAuthenticationCredential } from '../_debugger/decodeAuthenticationCredential';
import { authResponseToSigVerificationInput } from '../_debugger/authResponseToSigVerificationInput';
import { ethers } from 'ethers';

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
            email: '',
          }}
          onSubmit={async (values, {setErrors, setSubmitting }) => {
            setSubmitting(true); // 비동기통신


          const response = await generateWebAuthnLoginOptions(values.email);
          if (!response.success || !response.data || !response.user) {
            console.log(response.message ?? "Something went wrong!");
            return;
          }


          const uservalue : member = response.user;

          console.log(uservalue)
          console.log(response.data)



          const signatureResponse = await startAuthentication({
            challenge: response.data.challenge,
            allowCredentials: response.data.allowCredentials,
          });

          console.log(signatureResponse)

          const credId = `0x${base64url.toBuffer(signatureResponse.id).toString('hex')}`;
          console.log(credId);

          const { response: decodedResponse } = decodeAuthenticationCredential(signatureResponse);
          console.log('decoded webauthn response', decodedResponse)
          console.log('chellenge', decodedResponse.clientDataJSON.challenge)
          
          const ecVerifyInputs = authResponseToSigVerificationInput({}, signatureResponse.response);
          console.log('verify inputs', ecVerifyInputs);
        
          console.log('webauthn verify inputs', [
            ecVerifyInputs.messageHash,
            ecVerifyInputs.signature,
          ]);

          const p256sig = ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "uint256[2]"],
            [
              ecVerifyInputs.messageHash,
              ecVerifyInputs.signature
            ],
          )
          // 해당 sig를 useroperation에 추가한다.
          console.log(p256sig)

          const userOperation: UserOperation = response.userOperation;
          userOperation.signature = p256sig as `0x${string}`
          
          const bundlerSignResult : boolean = await bundlerSign(userOperation);
          
         if(bundlerSignResult){
          const verifyResponse = await verifyWebAuthnLogin(signatureResponse);
          console.log(verifyResponse)
          
          if (!verifyResponse.success) {
            alert(verifyResponse.message ?? "Something went wrong!");
            return;
          }
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
                              placeholder="email"
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
  