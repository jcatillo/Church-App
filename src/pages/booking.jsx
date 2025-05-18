import { Box, Heading, Separator, Flex, Field, Input, Stack, Button, InputGroup, createListCollection, Select, Portal } from '@chakra-ui/react';
import { useForm, Controller } from "react-hook-form"
import { withMask } from "use-mask-input"
import { Toaster, toaster } from "@/components/ui/toaster"
import { useState, useEffect } from 'react';
import { addBooking, getBookings } from '@/data/bookings';




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
    } = useForm()

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        addBooking(data);
        toaster.create({
            title: "Booking successful!",
            description: "Please check your email occasionally to see some updates",
            type: "success",
            duration: 5000,
            isClosable: true,
        });

    })

    const types = createListCollection({
    items: [
        { label: "Wedding", value: "wedding" },
        { label: "Wake Mass", value: "wake mass" },
        { label: "Healing Mass", value: "healing mass" },
        { label: "Deliverance", value: "deliverance" },
        { label: "Baptismal", value: "baptismal" },
    ],
    })
    
    return (
        // Using Flex with justifyContent and alignItems to center the Box
        
        <Flex 
            width="100%" 
            height="80vh" 
            justifyContent="center" 
            alignItems="center"
        >
            <Toaster />
            <Box 
                width="80%" 
                maxWidth="800px" 
                p={6} 
                borderRadius="md" 
                boxShadow="md"
            >
                <Heading size="3xl" mb={4} textAlign="center" fontWeight={"bold"}>Booking</Heading>
                <Separator mb={4} />
                <form onSubmit={onSubmit}>
                    <Stack gap="4" align="flex-start" maxW="sm">
                        <Field.Root invalid={errors.firstName ? true : false}>
                            <Field.Label>First name<span style={{ color: "red" }}>*</span></Field.Label>
                            <Input 
                                {...register("firstName", { 
                                    required: "First name is required" 
                                })}
                            />
                            <Field.ErrorText>{errors.firstName && errors.firstName.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={errors.lastName ? true : false}>
                            <Field.Label>Last name<span style={{ color: "red" }}>*</span></Field.Label>
                            <Input 
                                {...register("lastName", { 
                                    required: "Last name is required" 
                                })}
                            />
                            <Field.ErrorText>{errors.lastName && errors.lastName.message}</Field.ErrorText>
                        </Field.Root>
                        
                        <Field.Root invalid={errors.email ? true : false}>
                            <Field.Label>Email<span style={{ color: "red" }}>*</span></Field.Label>
                            <Input 
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex
                                        message: "Invalid email address",
                                    }
                                })}
                            />
                            <Field.ErrorText>{errors.email && errors.email.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={errors.phone ? true : false}>
                            <Field.Label>Phone<span style={{ color: "red" }}>*</span></Field.Label>
                            <InputGroup startElement={
                                <Box paddingX="2" display="flex" alignItems="center">
                                    +63
                                </Box>
                            }>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ 
                                        required: "Phone is required",
                                        pattern: {
                                            value: /^\d{3}-\d{3}-\d{4}$/,
                                            message: "Phone must be 10 digits (format: ###-###-####)",
                                        }
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
                            <Field.ErrorText>{errors.phone && errors.phone.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={errors.type ? true : false}>
                            <Field.Label>Select type<span style={{ color: "red" }}>*</span></Field.Label>
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
                                        <Select.HiddenSelect 
                                            name={field.name}
                                            ref={field.ref}
                                        />
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
                            <Field.ErrorText>{errors.type && errors.type.message}</Field.ErrorText>
                        </Field.Root>

                        <Button type="submit">Submit</Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
}