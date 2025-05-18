import { Flex, Avatar, Button, Card } from "@chakra-ui/react";
import "../assets/index.css";

const events = [
  {
    title: "LorenLorenLoren ",
    date: "12-25-2025",
    time: "10:00 AM",
    venue: "UC",
    image:
      "https://static.wikia.nocookie.net/aesthetics/images/a/a3/Pure_blue.png/revision/latest?cb=20210323184329",
    description:
      "A community gathering focused on arts, design, and creative storytelling.",
  },
  {
    title: "Tech Summit",
    date: "01-15-2026",
    time: "09:30 AM",
    venue: "City Convention Center",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Blue_gradient.png/800px-Blue_gradient.png",
    description:
      "A full-day summit covering new trends in software, AI, and cloud infrastructure.",
  },
  {
    title: "Code Camp",
    date: "03-10-2026",
    time: "01:00 PM",
    venue: "Innovation Hub",
    image:
      "https://static.vecteezy.com/system/resources/previews/004/703/001/non_2x/abstract-blue-gradient-blur-background-free-vector.jpg",
    description:
      "Hands-on coding workshops for beginners and intermediate developers.",
  },
  {
    title: "AI Conference",
    date: "05-20-2026",
    time: "03:00 PM",
    venue: "Tech Park",
    image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    description:
      "Talks and demos on machine learning, robotics, and ethical AI practices.",
  },
  {
    title: "Startup Pitch Night",
    date: "06-05-2026",
    time: "07:00 PM",
    venue: "Downtown Accelerator",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    description: "Local startups present their ideas to investors and mentors.",
  },
  {
    title: "Design Thinking Workshop",
    date: "07-12-2026",
    time: "10:00 AM",
    venue: "Creative Space",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    description:
      "Interactive sessions to explore user-centered design methods.",
  },
  {
    title: "Blockchain Expo",
    date: "08-22-2026",
    time: "11:30 AM",
    venue: "Expo Center",
    image: "https://images.unsplash.com/photo-1531497865149-9a378e01efcb",
    description:
      "Explore blockchain applications, security, and latest projects.",
  },
  {
    title: "Mobile Dev Meetup",
    date: "09-18-2026",
    time: "06:00 PM",
    venue: "Tech Hub",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    description:
      "Networking and talks for mobile app developers and designers.",
  },
  {
    title: "Cybersecurity Forum",
    date: "10-10-2026",
    time: "09:00 AM",
    venue: "Security Center",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description:
      "Discussions on threats, protection strategies, and compliance.",
  },
  {
    title: "Cybersecurity Forum",
    date: "10-10-2024",
    time: "09:00 AM",
    venue: "Security Center",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description: "Discussions on threats ection strategies, and compliance.",
  },
  {
    title: "Cybersecurity Forum",
    date: "10-10-2021",
    time: "09:00 AM",
    venue: "Security Center",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description:
      "Discussions on threats, protection strategies, and compliance.",
  },
];

function splitEventsByDate(events) {
  const now = new Date();

  const pastEvents = [];
  const upcomingEvents = [];

  for (const event of events) {
    // Parse the date string in MM-DD-YYYY format
    const [month, day, year] = event.date.split("-").map(Number);
    // Parse the time string
    const [time, modifier] = event.time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert 12-hour format to 24-hour format
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // Create Date object (months are 0-indexed in JavaScript)
    const eventDateTime = new Date(year, month - 1, day, hours, minutes);

    if (eventDateTime < now) {
      pastEvents.push(event);
    } else {
      upcomingEvents.push(event);
    }
  }

  return {
    past: pastEvents,
    upcoming: upcomingEvents,
  };
}

const { past, upcoming } = splitEventsByDate(events);

export function Events() {
  return (
    <>
      <h1
        className="label"
        style={{ marginBottom: "10px", marginLeft: "20px" }}
      >
        Upcoming Events
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
            background: "transparent", // Invisible by default
            borderRadius: "10px",
            transition: "all 0.3s ease",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "#A0AEC0", // gray.300 hex value
          },
        }}
      >
        {upcoming.map((event, key) => (
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
                direction={["column", "row"]} // column on mobile, row on larger screens
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
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {event.date}
                    </Card.Title>
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {event.time}
                    </Card.Title>
                  </Flex>
                </Avatar.Root>
                <Flex
                  direction="column"
                  style={{ width: "100%" }}
                  justify={"center"}
                >
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
                        maxHeight: "10rem", // Approximately 2 lines of text at 1rem font-size
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
        ))}
      </Flex>

      <h1
        style={{ marginTop: "10px", marginBottom: "20px", marginLeft: "20px" }}
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
            background: "transparent", // Invisible by default
            borderRadius: "10px",
            transition: "all 0.3s ease",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "#A0AEC0", // gray.300 hex value
          },
        }}
      >
        {past.map((event, key) => (
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
                direction={["column", "row"]} // column on mobile, row on larger screens
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
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {event.date}
                    </Card.Title>
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {event.time}
                    </Card.Title>
                  </Flex>
                </Avatar.Root>
                <Flex
                  direction="column"
                  style={{ width: "100%" }}
                  justify={"center"}
                >
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
                        maxHeight: "10rem", // Approximately 2 lines of text at 1rem font-size
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
        ))}
      </Flex>
    </>
  );
}
