import { useEffect, useState } from "react";
import { addBooking, getBookings } from "@/data/bookings";
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
} from "@chakra-ui/react";
import { LuCheck, LuX, LuPencil } from "react-icons/lu";
import { useColorModeValue } from "@/components/ColorMode";
import { updateBooking } from "@/data/bookings";

export function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const colorMode = useColorModeValue();
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const booking = await getBookings();
        setBookings(booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const acceptBooking = async (data, status) => {
    try {
      setLoading(true);
      await updateBooking({ ...data, status: status });

      setBookings((prev) => {
        const updated = prev.map((booking) =>
          booking.id === data.id ? { ...booking, status } : booking
        );
        console.log(updated); // log the updated version
        return updated;
      });
    } catch (error) {
      console.error("Failed to accept booking:", error);
    } finally {
      setLoading(false);
    }
  };

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
      return false; // skip Action for cancelled tab
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

                {activeTab === "pending"
                  ? "Action"
                  : activeTab === "accepted"
                  ? status
                  : ""}
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
                  <Text
                    noOfLines={1}
                    fontSize="sm"
                  >{`${data.fname} ${data.lname}`}</Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.email}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.phone}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.bookingType}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.date}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.time}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    {data.status}
                  </Text>
                  <HStack spacing={3} justify="flex-start">
                    {data.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<LuCheck />}
                          bgColor={"green"}
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
                          leftIcon={<LuPencil />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          bgColor="red"
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
                        {" "}
                        <Button
                          size="sm"
                          bgColor="blue.500"
                          leftIcon={<LuPencil />}
                          variant="solid"
                          minW="90px"
                          fontSize="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          bgColor="red"
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
                      <>{/* cancelled (maybe empty) */}</>
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
