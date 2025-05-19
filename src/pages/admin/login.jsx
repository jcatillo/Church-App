import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  Field,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Toaster, toaster } from "@/components/ui/toaster";
import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { set } from "date-fns";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(auth.currentUser);

      if (auth.currentUser) {
        toaster.create({
          title: "Login successful.",
          description: "You have logged in successfully.",
          type: "success",
        });

        setTimeout(() => {
          navigate("/admin/home");
        }, 1500);
      } else {
        setLoading(false);
        toaster.create({
          title: "Login failed.",
          description: "Please provide the correct credentials.",
          type: "error",
        });
      }
    } catch (err) {
      setLoading(false);
      toaster.create({
        title: "Login failed.",
        description: "Please provide the correct credentials.",
        type: "error",
      });
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Toaster />
      <Heading mb={6} textAlign="center" size="lg">
        Login as Admin
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Field.Root invalid={errors.email ? true : false}>
            <Field.Label>
              Email<span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            <Field.ErrorText>
              {errors.email && errors.email.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={errors.password ? true : false}>
            <Field.Label>
              Password<span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <Field.ErrorText>
              {errors.password && errors.password.message}
            </Field.ErrorText>
          </Field.Root>

          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
