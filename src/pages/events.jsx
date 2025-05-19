import {
  Flex,
  Avatar,
  Button,
  Card,
  Spinner,
  Text,
  Input,
} from "@chakra-ui/react";
import "../assets/index.css";
import { useEffect, useState } from "react";
import { getEvents } from "@/data/calendar";

function convertEvent(original) {
  const startDate = new Date(original.start);

  const month = String(startDate.getMonth() + 1).padStart(2, "0");
  const day = String(startDate.getDate()).padStart(2, "0");
  const year = startDate.getFullYear();
  const date = `${month}-${day}-${year}`;

  let hours = startDate.getHours();
  const minutes = String(startDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${ampm}`;

  return {
    title: original.title,
    date,
    time,
    description: original.description || "",
  };
}

export function Events() {
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedEventsRaw = await getEvents();
        const fetchedEvents = fetchedEventsRaw.map(convertEvent);
        setEvents(fetchedEvents);

        const now = new Date();
        const pastEvents = [];
        const upcomingEvents = [];

        for (const event of fetchedEvents) {
          const [month, day, year] = event.date.split("-").map(Number);
          const [time, modifier] = event.time.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          if (modifier === "PM" && hours !== 12) {
            hours += 12;
          } else if (modifier === "AM" && hours === 12) {
            hours = 0;
          }

          const eventDateTime = new Date(year, month - 1, day, hours, minutes);

          if (eventDateTime < now) {
            pastEvents.push(event);
          } else {
            upcomingEvents.push(event);
          }
        }

        setPast(pastEvents);
        setUpcoming(upcomingEvents);
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter events based on search query
  const filteredUpcoming = upcoming.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = past.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const combinedEvents = [...filteredUpcoming, ...filteredPast].sort((a, b) => {
    const [monthA, dayA, yearA] = a.date.split("-").map(Number);
    const [timeA, modifierA] = a.time.split(" ");
    let [hoursA, minutesA] = timeA.split(":").map(Number);
    if (modifierA === "PM" && hoursA !== 12) hoursA += 12;
    if (modifierA === "AM" && hoursA === 12) hoursA = 0;
    const dateA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);

    const [monthB, dayB, yearB] = b.date.split("-").map(Number);
    const [timeB, modifierB] = b.time.split(" ");
    let [hoursB, minutesB] = timeB.split(":").map(Number);
    if (modifierB === "PM" && hoursB !== 12) hoursB += 12;
    if (modifierB === "AM" && hoursB === 12) hoursB = 0;
    const dateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

    return dateB - dateA; // Sort in descending order (most recent first)
  });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100%" width="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100%" width="100%">
        <Text color="red.500">
          Failed to load events. Please try again later.
        </Text>
      </Flex>
    );
  }

  const renderEventCard = (event, key) => (
    <Card.Root
      key={key}
      style={{
        width: "390px",
        height: "180px",
        marginBottom: "16px",
        marginTop: "10px",
        flexShrink: 0,
        cursor: "grab",
        overflow: "hidden",
      }}
      _hover={{
        color: "red",
        transform: "scale(1.07)",
      }}
      transition="all 0.6s ease"
      willChange="transform, color"
      className="responsive-card"
    >
      <Card.Body gap="2">
        <Flex
          direction={["column", "row"]}
          gap={"4"}
          style={{ textAlign: "left", width: "100%" }}
        >
          <Avatar.Root
            style={{
              minWidth: "8rem",
              minHeight: "6rem",
              alignContent: "center",
            }}
            shape="rounded"
          >
            <Flex direction="column">
              <Card.Title style={{ fontSize: "1rem" }}>{event.date}</Card.Title>
              <Card.Title style={{ fontSize: "1rem" }}>{event.time}</Card.Title>
            </Flex>
          </Avatar.Root>
          <Flex direction="column" style={{ width: "100%" }} justify={"center"}>
            <Flex direction="column" justify="center" grow={0}>
              <Card.Title
                style={{
                  fontSize: "1.2rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {event.title}
              </Card.Title>
              <Card.Description
                style={{
                  fontSize: "1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  maxHeight: "10rem",
                }}
              >
                {event.description}
              </Card.Description>
            </Flex>
          </Flex>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent="flex-end"></Card.Footer>
    </Card.Root>
  );

  return (
    <>
      <Flex
        direction="row"
        gap="1300px"
        padding="10px 20px"
        justifyContent={"flex-start"}
      >
        <h1 className="label" style={{ marginBottom: "10px" }}>
          {searchQuery ? "Events" : "Upcoming Events"}
        </h1>
        <Input
          placeholder="Search events by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="md"
          maxWidth="300px"
          marginLeft={"20px"}
        />
      </Flex>

      {searchQuery ? (
        <Flex
          direction="row"
          align="center"
          width="100%"
          gap="4vh"
          overflowX="auto"
          overflowY="hidden"
          maxHeight={"81dvh"}
          flex="1"
          padding="0 10px"
          grow={0}
          css={{
            "&::-webkit-scrollbar": {
              height: "4px",
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              background: "#A0AEC0",
            },
          }}
        >
          {combinedEvents.length > 0 ? (
            combinedEvents.map((event, key) => renderEventCard(event, key))
          ) : (
            <Text style={{ marginLeft: "20px" }}>
              No events match your search
            </Text>
          )}
        </Flex>
      ) : (
        <>
          <Flex
            direction="row"
            align="center"
            width="100%"
            gap="4vh"
            overflowX="auto"
            overflowY="hidden"
            maxHeight={"81dvh"}
            flex="1"
            padding="0 10px"
            grow={0}
            css={{
              "&::-webkit-scrollbar": {
                height: "4px",
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "10px",
                transition: "all 0.3s ease",
              },
              "&:hover::-webkit-scrollbar-thumb": {
                background: "#A0AEC0",
              },
            }}
          >
            {filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((event, key) => renderEventCard(event, key))
            ) : (
              <Text style={{ marginLeft: "20px" }}>
                No upcoming events match your search
              </Text>
            )}
          </Flex>

          <h1
            style={{
              marginTop: "10px",
              marginBottom: "20px",
              marginLeft: "20px",
            }}
          >
            Past Events
          </h1>
          <Flex
            direction="row"
            align="center"
            width="100%"
            gap="4vh"
            overflowX="auto"
            overflowY="hidden"
            maxHeight={"81dvh"}
            flex="1"
            padding="0 10px"
            grow={0}
            css={{
              "&::-webkit-scrollbar": {
                height: "4px",
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "10px",
                transition: "all 0.3s ease",
              },
              "&:hover::-webkit-scrollbar-thumb": {
                background: "#A0AEC0",
              },
            }}
          >
            {filteredPast.length > 0 ? (
              filteredPast.map((event, key) => renderEventCard(event, key))
            ) : (
              <Text style={{ marginLeft: "20px" }}>
                No past events match your search
              </Text>
            )}
          </Flex>
        </>
      )}
    </>
  );
}
