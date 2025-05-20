import { useEffect, useState } from "react";
import { addBooking, getBookings, updateBooking } from "@/data/bookings";
import { addBookingToCalendar, updateCalendarEvent, deleteCalendarEvent } from "@/data/calendar";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
  Container,
  Button,
  HStack,
  Stack,
  Input,
  Select,
  Portal,
  Field,
} from "@chakra-ui/react";
import { LuCheck, LuX, LuPencil, LuSave } from "react-icons/lu";
import { useColorModeValue } from "@/components/ColorMode";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createListCollection } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { sendCancellationEmail, sendAcceptanceEmail } from "@/services/emailService";
export function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const colorMode = useColorModeValue();
  const [editingId, setEditingId] = useState(null);
  const toast = toaster;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const booking = await getBookings();
        setBookings(booking);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.create({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          type: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptBooking = async (data, status) => {
    try {
      setLoading(true);
      // Update booking status
      await updateBooking({ ...data, status });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === data.id ? { ...booking, status } : booking
        )
      );

      // Prepare email data
      const emailData = {
        name: `${data.fname} ${data.lname}`,
        bookingType: data.bookingType,
        booking: data.bookingType, // Assuming 'booking' is same as bookingType; adjust if needed
        bookingid: data.id,
        event_type: data.bookingType, // Adjust if event_type is different
        date: data.date,
        time: data.time,
        email: data.email,
        phone: data.phone,
        sender_name: "Rey Angelo Ramilo", // Replace with actual sender name or config
        sender_position: "Administrator", // Replace with actual position or config
        sender_contact: "stvpdanao55@gmail.com", // Replace with actual contact or config
        organization_name: "Sto Tomas De Villanueva - Danao", // Replace with actual organization name
      };

      // If booking is accepted, add to calendar and send acceptance email
      if (status === "accepted") {
        const clientName = `${data.fname} ${data.lname}`;
        const startDateTime = `${data.date} ${data.time}`; // e.g., "2025-05-20 09:00"
        const startDate = new Date(`${data.date}T${data.time}:00`);
        const endDate = new Date(startDate);
        // Set end time: 1 hour for mass, 1.5 hours for others
        if (data.bookingType === "mass") {
          endDate.setHours(endDate.getHours() + 1);
        } else {
          endDate.setHours(endDate.getHours() + 1);
          endDate.setMinutes(endDate.getMinutes() + 30);
        }
        const endDateTime = `${data.date} ${endDate
          .toTimeString()
          .slice(0, 5)}`; // e.g., "2025-05-20 10:00"

        const calendarEvent = {
          id: data.id, // Use booking ID
          title: `${data.bookingType} - ${clientName}`,
          start: startDateTime,
          end: endDateTime,
          description: `${clientName} - ${data.phone} - ${clientName}`,
          calendarId: "booking",
        };

        await addBookingToCalendar(calendarEvent);
        await sendAcceptanceEmail(emailData); // Send acceptance email
        console.log("Added to calendar and sent acceptance email:", calendarEvent);
      } else if (status === "cancelled" && data.status === "accepted") {
        // If booking is cancelled and was previously accepted, delete calendar event and send cancellation email
        await deleteCalendarEvent(data.id);
        await sendCancellationEmail(emailData); // Send cancellation email
        console.log("Deleted calendar event and sent cancellation email:", data.id);
      } else if (status === "cancelled") {
        // If booking is cancelled but was not accepted, just send cancellation email
        await sendCancellationEmail(emailData); // Send cancellation email
        console.log("Sent cancellation email:", data.id);
      }

      toast.create({
        title: "Success",
        description: `Booking ${status === "accepted" ? "accepted and added to calendar" : "cancelled"} successfully. Email sent.`,
        type: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update booking, modify calendar, or send email:", error);
      toast.create({
        title: "Error",
        description: "Failed to update booking, modify calendar, or send email. Please try again.",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (booking) => {
    setEditingId(booking.id);
    reset({
      fname: booking.fname,
      lname: booking.lname,
      email: booking.email,
      phone: booking.phone,
      bookingType: booking.bookingType,
      date: booking.date ? new Date(booking.date) : null,
      time: booking.time ? new Date(`1970-01-01T${booking.time}:00`) : null,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    reset({});
  };

  const saveEditing = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        id: editingId,
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        phone: data.phone,
        bookingType: data.bookingType,
        date: data.date ? data.date.toISOString().split("T")[0] : "",
        time: data.time ? data.time.toTimeString().slice(0, 5) : "",
        status: bookings.find((b) => b.id === editingId).status,
      };

      // Update booking in Firestore
      await updateBooking(formattedData);

      // If booking is accepted, update the corresponding calendar event
      if (formattedData.status === "accepted") {
        const clientName = `${data.fname} ${data.lname}`;
        const startDateTime = `${formattedData.date} ${formattedData.time}`;
        const startDate = new Date(`${formattedData.date}T${formattedData.time}:00`);
        const endDate = new Date(startDate);
        if (data.bookingType === "mass") {
          endDate.setHours(endDate.getHours() + 1);
        } else {
          endDate.setHours(endDate.getHours() + 1);
          endDate.setMinutes(endDate.getMinutes() + 30);
        }
        const endDateTime = `${formattedData.date} ${endDate
          .toTimeString()
          .slice(0, 5)}`;

        const calendarEvent = {
          title: `${data.bookingType} - ${clientName}`,
          start: startDateTime,
          end: endDateTime,
          description: `${clientName} - ${data.phone} - ${clientName}`,
          calendarId: "booking",
        };

        await updateCalendarEvent(formattedData.id, calendarEvent);
        console.log("Updated calendar event:", calendarEvent);
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingId ? { ...booking, ...formattedData } : booking
        )
      );
      setEditingId(null);
      reset({});

      toast.create({
        title: "Success",
        description: "Booking updated successfully.",
        type: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to save booking or update calendar:", error);
      toast.create({
        title: "Error",
        description: "Failed to save booking or update calendar. Please try again.",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const types = createListCollection({
    items: [
      { label: "Wedding", value: "wedding" },
      { label: "Wake Mass", value: "wake mass" },
      { label: "Mass", value: "mass" },
      { label: "Deliverance", value: "deliverance" },
      { label: "Baptismal", value: "baptismal" },
    ],
  });

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Booking Type",
    "Date",
    "Time",
    "Status",
    "Action",
  ];

  const filteredHeaders = headers.filter((header) => {
    if (header === "Action" && activeTab === "cancelled") {
      return false;
    }
    return true;
  });

  const filteredBookings = bookings.filter((booking) => {
    const matchesTab =
      (activeTab === "upcoming" &&
        (booking.status === "pending" || booking.status === "confirmed")) ||
      (activeTab === "done" && booking.status === "accepted") ||
      (activeTab === "cancelled" &&
        (booking.status === "cancelled" || booking.status === "missed"));

    const matchesSearch =
      searchQuery === "" ||
      `${booking.fname} ${booking.lname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Toaster />
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading>Booking Management</Heading>
        </Flex>
        <HStack spacing={4}>
          <Button
            variant={activeTab === "upcoming" ? "solid" : "outline"}
            onClick={() => setActiveTab("upcoming")}
          >
            Pending Bookings
          </Button>
          <Button
            variant={activeTab === "done" ? "solid" : "outline"}
            onClick={() => setActiveTab("done")}
          >
            Accepted Bookings
          </Button>
          <Button
            variant={activeTab === "cancelled" ? "solid" : "outline"}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled Bookings
          </Button>
        </HStack>

        <Input
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          borderColor={colorMode === "light" ? "black" : "white"}
          size="md"
        />

        <Box overflowX="auto" borderRadius="lg" boxShadow="md">
          {loading ? (
            <Flex justify="center" p={8}>
              <Spinner />
            </Flex>
          ) : (
            <>
              <Grid
                templateColumns="1.2fr 1.5fr 1.3fr 1.5fr 1.0fr 1.2fr 1fr 2.5fr"
                p={4}
                fontWeight="bold"
                borderBottom="2px solid"
                alignItems="center"
                bg="gray.50"
              >
                {filteredHeaders.map((header) => (
                  <Text
                    key={header}
                    noOfLines={1}
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    {header}
                  </Text>
                ))}
              </Grid>
              {filteredBookings.map((data) => (
                <Grid
                  key={data.id}
                  templateColumns="1.2fr 1.5fr 1.3fr 1.5fr 1.0fr 1.2fr 1fr 2.5fr"
                  p={4}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  alignItems="center"
                  _hover={{
                    bg: "gray.50",
                  }}
                >
                  {editingId === data.id ? (
                    <>
                      <HStack>
                        <Field.Root invalid={!!errors.fname}>
                          <Controller
                            name="fname"
                            control={control}
                            rules={{ required: "First name is required" }}
                            render={({ field }) => (
                              <Input
                                size="sm"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="First name"
                                isInvalid={!!errors.fname}
                              />
                            )}
                          />
                          <Field.ErrorText>{errors.fname?.message}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.lname}>
                          <Controller
                            name="lname"
                            control={control}
                            rules={{ required: "Last name is required" }}
                            render={({ field }) => (
                              <Input
                                size="sm"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Last name"
                                isInvalid={!!errors.lname}
                              />
                            )}
                          />
                          <Field.ErrorText>{errors.lname?.message}</Field.ErrorText>
                        </Field.Root>
                      </HStack>
                      <Field.Root invalid={!!errors.email}>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              size="sm"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              placeholder="Email"
                              isInvalid={!!errors.email}
                            />
                          )}
                        />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={!!errors.phone}>
                        <Controller
                          name="phone"
                          control={control}
                          rules={{
                            required: "Phone is required",
                            pattern: {
                              value: /^\d{3}-\d{3}-\d{4}$/,
                              message: "Phone must be ###-###-####",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              size="sm"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              placeholder="###-###-####"
                              isInvalid={!!errors.phone}
                            />
                          )}
                        />
                        <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={!!errors.bookingType}>
                        <Controller
                          name="bookingType"
                          control={control}
                          rules={{ required: "Booking type is required" }}
                          render={({ field }) => (
                            <Select.Root
                              size="sm"
                              value={field.value}
                              onValueChange={(item) => field.onChange(item.value)}
                              collection={types}
                              isInvalid={!!errors.bookingType}
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
                        <Field.ErrorText>{errors.bookingType?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={!!errors.date}>
                        <Controller
                          name="date"
                          control={control}
                          rules={{ required: "Date is required" }}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              minDate={new Date()}
                              dateFormat="yyyy-MM-dd"
                              customInput={<Input size="sm" isInvalid={!!errors.date} />}
                              placeholderText="Select date"
                            />
                          )}
                        />
                        <Field.ErrorText>{errors.date?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={!!errors.time}>
                        <Controller
                          name="time"
                          control={control}
                          rules={{ required: "Time is required" }}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeFormat="HH:mm"
                              dateFormat="HH:mm"
                              customInput={<Input size="sm" isInvalid={!!errors.time} />}
                              placeholderText="Select time"
                            />
                          )}
                        />
                        <Field.ErrorText>{errors.time?.message}</Field.ErrorText>
                      </Field.Root>
                    </>
                  ) : (
                    <>
                      <Text noOfLines={1} fontSize="sm">{`${data.fname} ${data.lname}`}</Text>
                      <Text noOfLines={1} fontSize="sm">{data.email}</Text>
                      <Text noOfLines={1} fontSize="sm">{data.phone}</Text>
                      <Text noOfLines={1} fontSize="sm">{data.bookingType}</Text>
                      <Text noOfLines={1} fontSize="sm">{data.date}</Text>
                      <Text noOfLines={1} fontSize="sm">{data.time}</Text>
                    </>
                  )}
                  <Text noOfLines={1} fontSize="sm">{data.status}</Text>
                  <HStack spacing={3} justify="flex-start">
                    {editingId === data.id ? (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<LuSave />}
                          bgColor="blue.500"
                          color="white"
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={handleSubmit(saveEditing)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<LuX />}
                          bgColor="gray.500"
                          color="white"
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : data.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<LuCheck />}
                          bgColor="green.500"
                          color="white"
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={() => acceptBooking(data, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          bgColor="blue.500"
                          color="white"
                          leftIcon={<LuPencil />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={() => startEditing(data)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          bgColor="red.500"
                          color="white"
                          leftIcon={<LuX />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={() => acceptBooking(data, "cancelled")}
                        >
                          Decline
                        </Button>
                      </>
                    ) : data.status === "accepted" ? (
                      <>
                        <Button
                          size="sm"
                          bgColor="blue.500"
                          color="white"
                          leftIcon={<LuPencil />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={() => startEditing(data)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          bgColor="red.500"
                          color="white"
                          leftIcon={<LuX />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                          onClick={() => acceptBooking(data, "cancelled")}
                        >
                          Decline
                        </Button>
                      </>
                    ) : data.status === "cancelled" ? (
                      <></>
                    ) : null}
                  </HStack>
                </Grid>
              ))}
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
}