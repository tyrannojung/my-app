'use client'
import { Col, Button, Row, Container, Card, Form, InputGroup  } from 'react-bootstrap';
import TOKAMAK_ICON from '@/public/assets/tn_logo.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { member } from "@/app/_types/member"
import * as formik from 'formik';
import * as yup from 'yup';

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  generateWebAuthnLoginOptions,
  generateWebAuthnRegistrationOptions,
  verifyWebAuthnLogin,
  verifyWebAuthnRegistration,
} from "@/app/_libraries/webauthn";


export default function Signup() {
  
  const { Formik } = formik;
  const router = useRouter();

  const validationSchema = yup.object().shape({
    id: yup.string()
      //.min(5, 'ID must be at least 5 characters')
      .matches(
        /^(?=.*[a-z])[a-z0-9]{5,20}$/i,
        "ID must be 5 to 20 characters and can only contain letters and numbers."
      )
      .required('Required'),
    publicKey: yup.string()
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum public key format')
      .required('Required'),
    email: yup.string()
      .email('Invalid email address')
      .required('Required'),
    name: yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(20, 'Name must be 20 characters or less')
      .matches(
        /^[A-Za-z가-힣\s]{2,20}$/,
        "Real name must be 2 to 20 characters and should only contain letters and spaces."
      )
      .required('Required'),
  });
  
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        id: 'tyrannojung',
        publicKey: '0x84207aCCB87EC578Bef5f836aeC875979C1ABA85',
        email: 'tyrannojung@korea.ac.kr',
        name: 'dawoon jung',
      }}

      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true); // 비동기통신

        const response_value = await generateWebAuthnRegistrationOptions(values.email);
        console.log(response_value)
        
        if (!response_value.success || !response_value.data) {
          alert(response_value.message ?? "Something went wrong!");
          return;
        }
        
        const localResponse = await startRegistration(response_value.data);
        console.log(localResponse);

        // let attestationObject       = 'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVikSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAK3OAAI1vMYKZIsLJfHwVQMAIHQFU9tBiWtuIqKAG2btlYGSDsX4zTuWtnkxn9uLdZoCpQECAyYgASFYIBDPg8cTc2Lkpk82AL6_gEjgFRQudTlgKNjmeU1xawHAIlggnOL6S6X-CwL7-XPhZQZuUqICqM1Zb8jVeTeh7z1XXZw-CF1sTfoB3bdDG77X49YYaht0v9hndgyNpCBhE-OpQECAyYgASFYIEunCwFLgZ8KosUQ-_daikFfOiu139Og5XSdAS3uFbVVIlggzu88KGOjpBUTBWjfTVsya1nAkQGdXYCU-ziSgdtIq18'
        // let attestationObjectBuffer = base64url.toBuffer(attestationObject);
        // let ctapMakeCredResp        = cbor.decodeAllSync(attestationObjectBuffer)[0];
        // console.log(ctapMakeCredResp);
        const verifyResponse = await verifyWebAuthnRegistration(localResponse);
        console.log(verifyResponse);
        
        // const member_info : member = {
        //   id : values.id,
        //   publicKey : values.publicKey,
        //   email : values.email,
        //   name : values.name,
        //   updatedAt : null,
        //   createAt : new Date()
        // }

        // const options = {
        //   method: 'POST',
        //   headers: {
        //       'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(member_info)
        // }

        // const resp = await fetch('/api/member/signup/', options);
        // const data = await resp.json()
        // if(data.result == "success") {
        //   router.push('/');
        //   router.refresh();
        // }

      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors}) => (
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
                    <Form noValidate onSubmit={e => {
                      e.preventDefault();
                      handleSubmit(e)
                    }} autoComplete="off">
                        <Form.Group className="mb-3" controlId="ID">
                          <Form.Label className="text-center">
                            ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="id"
                            value={values.id}
                            onChange={handleChange}
                            isValid={touched.id && !errors.id}
                            isInvalid={!!errors.id}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                              {errors.id}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="text-center">
                            Email address
                          </Form.Label>
                          <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control
                              type="text"
                              placeholder="email"
                              aria-describedby="inputGroupPrepend"
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
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              isValid={touched.name && !errors.name}
                              isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                              </Form.Control.Feedback>
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
                          <a href="/signin" className="text-primary fw-bold">
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
      )}
    </Formik>
  );
}
  