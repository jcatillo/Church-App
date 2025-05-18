import {
  Box,
  Heading,
  Separator,
  Flex,
  Field,
  Input,
  Stack,
  Button,
  InputGroup,
  createListCollection,
  Select,
  Portal,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { addBooking, getBookings } from "@/data/bookings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Booking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    // Format the date to ensure it's properly captured
    const formattedData = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
    };

    console.log(formattedData);
    addBooking(formattedData);
    reset();
    toaster.create({
      title: "Booking successful!",
      description: "Please check your email occasionally to see some updates",
      type: "success",
      duration: 5000,
      isClosable: true,
    });
  });

  const types = createListCollection({
    items: [
      { label: "Wedding", value: "wedding" },
      { label: "Wake Mass", value: "wake mass" },
      { label: "Healing Mass", value: "healing mass" },
      { label: "Deliverance", value: "deliverance" },
      { label: "Baptismal", value: "baptismal" },
    ],
  });

  return (
    <Flex
      width="100%"
      height="100%"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      py={8}
    >
      <Toaster />
      <Box
        width="90%"
        maxWidth="800px"
        p={6}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading size="3xl" mb={4} textAlign="center" fontWeight={"bold"}>
          Booking
        </Heading>
        <Separator mb={4} />
        <form onSubmit={onSubmit}>
          <Stack gap="4" align="flex-start" maxW="sm">
            <Field.Root invalid={errors.firstName ? true : false}>
              <Field.Label>
                First name<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <Input
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              <Field.ErrorText>
                {errors.firstName && errors.firstName.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.lastName ? true : false}>
              <Field.Label>
                Last name<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <Input
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              <Field.ErrorText>
                {errors.lastName && errors.lastName.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.email ? true : false}>
              <Field.Label>
                Email<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex
                    message: "Invalid email address",
                  },
                })}
              />
              <Field.ErrorText>
                {errors.email && errors.email.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.phone ? true : false}>
              <Field.Label>
                Phone<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <InputGroup
                startElement={
                  <Box paddingX="0" display="flex" alignItems="center">
                    +63
                  </Box>
                }
              >
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone is required",
                    pattern: {
                      value: /^\d{3}-\d{3}-\d{4}$/,
                      message: "Phone must be 10 digits (format: ###-###-####)",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      paddingLeft="12"
                      placeholder="###-###-####"
                      value={value || ""}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={(e) => {
                        ref(e);
                        withMask("999-999-9999")(e);
                      }}
                    />
                  )}
                />
              </InputGroup>
              <Field.ErrorText>
                {errors.phone && errors.phone.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.type ? true : false}>
              <Field.Label>
                Select type<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Booking type is required" }}
                defaultValue=""
                render={({ field }) => (
                  <Select.Root
                    invalid={errors.type ? true : false}
                    collection={types}
                    size="sm"
                    width="320px"
                    onValueChange={(item) => {
                      if (item) {
                        field.onChange(item.value);
                      }
                    }}
                  >
                    <Select.HiddenSelect name={field.name} ref={field.ref} />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {types.items.map((type) => (
                            <Select.Item item={type} key={type.value}>
                              {type.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>
                {errors.type && errors.type.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.date ? true : false}>
              <Field.Label>
                Select date<span style={{ color: "red" }}>*</span>
              </Field.Label>
              <form autoComplete="off">
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="yyyy/MM/dd"
                      customInput={<Input autoComplete="off" />}
                      minDate={new Date()}
                    />
                  )}
                />
              </form>
              <Field.ErrorText>
                {errors.date && errors.date.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.time ? true : false}>
              <Field.Label>
                Select Time<span style={{ color: "red" }}>*</span>
              </Field.Label>

              <form autoComplete="off">
                <Controller
                  control={control}
                  name="time"
                  rules={{ required: "Time is required" }}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="Select Time"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      customInput={<Input />}
                    />
                  )}
                />
              </form>
              <Field.ErrorText>
                {errors.date && errors.date.message}
              </Field.ErrorText>
            </Field.Root>

            <Button type="submit" colorScheme="blue" mt={2}>
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}