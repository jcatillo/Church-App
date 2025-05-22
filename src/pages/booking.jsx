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
import { addToCalendar } from "@/data/calendar";
import { useSearchParams, useNavigate } from "react-router-dom";

const services = [
  {
    title: "Wake Mass",
    value: "wake mass",
    description:
      "A special mass held for the deceased, offering prayers and comfort for grieving families.",
    image:
      "https://images.pexels.com/photos/257030/pexels-photo-257030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Wedding",
    value: "wedding",
    description:
      "A sacred ceremony celebrating the union of two people in holy matrimony, blessed by God.",
    image:
      "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Baptismal",
    value: "baptismal",
    description:
      "A baptismal rite symbolizing purification, rebirth, and acceptance into the Christian faith.",
    image:
      "https://images.pexels.com/photos/17120314/pexels-photo-17120314/free-photo-of-baptism-of-newborn-baby.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Mass",
    value: "mass",
    description:
      "The central act of worship in the Catholic Church, where the faithful gather to celebrate the Eucharist, receive spiritual nourishment, and strengthen their faith through prayer and community.",
    image:
      "https://christthekingparish.ph/wp-content/uploads/2016/09/healing-mass-2.jpg",
  },
  {
    title: "Deliverance",
    value: "deliverance",
    description:
      "A ministry that involves prayers to break spiritual bondages and reclaim spiritual freedom.",
    image:
      "https://i.swncdn.com/media/960w/cms/CW/49758-Jesus-crucifixion-1200x627-thinkstock.1200w.tn.webp",
  },
];

export function Booking() {
  const [bookings, setBookings] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryType = searchParams.get("type") || "";

  console.log("Query type:", queryType);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
        console.log("Fetched bookings:", data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
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
    setValue,
  } = useForm({
    defaultValues: {
      type: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: null,
      time: null,
    },
  });

  const types = createListCollection({
    items: services.map((service) => ({
      label: service.title,
      value: service.value,
    })),
  });

  // Validate queryType and redirect if invalid
  useEffect(() => {
    if (queryType) {
      const validType = services.find((service) => service.value === queryType);
      if (validType) {
        setValue("type", queryType);
      } else {
        toaster.create({
          title: "Invalid booking type",
          description: "Please select a valid booking type.",
          type: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/"); // Redirect to error page
      }
    }
  }, [queryType, setValue, navigate]);

  const onSubmit = handleSubmit((data) => {
    const formattedData = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
    };

    addBooking(formattedData);
    reset({
      type: queryType,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: null,
      time: null,
    });
    toaster.create({
      title: "Booking successful!",
      description: "Please check your email occasionally to see some updates",
      type: "success",
      duration: 5000,
      isClosable: true,
    });
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
      <Box width="90%" maxWidth="800px" p={6} borderRadius="md" boxShadow="md">
        <Heading size="3xl" mb={4} textAlign="center" fontWeight="bold">
          Booking
        </Heading>
        <Separator mb={4} />
        <form onSubmit={onSubmit} autoComplete="off">
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
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                render={({ field }) => (
                  <Select.Root
                    invalid={errors.type ? true : false}
                    collection={types}
                    size="sm"
                    width="320px"
                    value={field.value ? [field.value] : []}
                    onValueChange={({ value }) => {
                      console.log("Selected value:", value);
                      field.onChange(value[0] || "");
                      console.log("Field: " + value);
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
                              <Select.ItemText>{type.label}</Select.ItemText>
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
              <Controller
                control={control}
                name="date"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select Date"
                    {...field}
                    selected={field.value}
                    minDate={new Date()}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy/MM/dd"
                    customInput={<Input autoComplete="off" />}
                  />
                )}
              />
              <Field.ErrorText>
                {errors.date && errors.date.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.time ? true : false}>
              <Field.Label>
                Select Time<span style={{ color: "red" }}>*</span>
              </Field.Label>
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
              <Field.ErrorText>
                {errors.time && errors.time.message}
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
