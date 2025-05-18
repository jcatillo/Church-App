import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Separator
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

// Animation for fade-up effect
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
  })
};

// Animation for image hover tilt
const imageHover = {
  whileHover: {
    rotateZ: 2,
    scale: 1.02,
    transition: { type: "spring", stiffness: 200, damping: 10 }
  }
};

export function AboutUs() {
  return (
    <Box maxW="1000px" mx="auto" p={10}>
      <Stack spacing={24}>
        {/* Introduction */}
        <MotionBox custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box mb={8}>
            <Heading as="h2" size="2xl" textAlign="center">
              About Our Church
            </Heading>
          </Box>
          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <MotionImage
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1b/43/d1/photo0jpg.jpg?w=1200&h=-1&s=1"
              alt="Church exterior"
              borderRadius="lg"
              boxShadow="lg"
              {...imageHover}
            />
            <Text fontSize="lg" textAlign="justify" mx={12}>
              Welcome to <strong>[Church Name]</strong>, a Christ-centered community committed to spreading love,
              faith, and hope. We are glad you're here. <br/> <br/>

              We are located at 123 Faith Street, Springfield. Easily accessible by public transport with ample parking available. 
              Come visit us and join our community!
            </Text>
          </SimpleGrid>
        </MotionBox>

        <Separator my={12}/>

        {/* History Section */}
        <MotionBox custom={1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box mb={8}>
            <Heading as="h3" size="xl" textAlign="center">
              Our History
            </Heading>
          </Box>
          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <Text fontSize="lg" textAlign="justify" mx={12}>
              [Church Name] was founded in 1985 by a small group of faithful believers with a vision to build a strong
              spiritual foundation in the community. Starting in a modest home gathering, the church quickly grew in
              numbers and spirit, eventually establishing a permanent place of worship.
              <br /><br />
              Over the decades, we've witnessed God's faithfulness through expanded ministries, growing outreach
              efforts, and transformed lives.
            </Text>
            <MotionImage
              src="https://www.phtourguide.com/wp-content/uploads/2010/07/DSC_3954.jpg"
              alt="Old photo of church gathering"
              borderRadius="lg"
              boxShadow="lg"
              {...imageHover}
            />
          </SimpleGrid>
        </MotionBox>

        <Separator my={12} />

        {/* Mission & Vision Section */}
        <MotionBox custom={2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box mb={8}>
            <Heading as="h3" size="xl" textAlign="center">
              Our Mission & Vision
            </Heading>
          </Box>
          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <MotionImage
              src="https://www.duran-subastas.com/img/thumbs/500/001/147/001-147-34.jpg?a=1675879324"
              alt="Mission and Vision"
              borderRadius="lg"
              boxShadow="lg"
              {...imageHover}
            />
            <Text fontSize="lg" textAlign="justify" mx={12}>
              Our mission is to glorify God by making disciples, serving the community, and living out the teachings of
              Jesus Christ. We aim to be a place of worship, healing, and transformation.
              <br /><br />
              Our vision is to build a spiritually mature church where every individual experiences the love of God and
              becomes a light to the world.
            </Text>
          </SimpleGrid>
        </MotionBox>

        <Separator my={12} />

        {/* Community & Ministry Section */}
        <MotionBox custom={3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box mb={8}>
            <Heading as="h3" size="xl" textAlign="center">
              Community & Ministry
            </Heading>
          </Box>
          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <Text fontSize="lg" textAlign="justify" mx={12}>
              We offer a variety of ministries including youth groups, Bible studies, prayer meetings, outreach
              programs, and Sunday worship services. Everyone is welcome, and there's a place for you to grow and
              serve.
            </Text>
            <MotionImage
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0sgOJaGYpgPx6hAS1oX2_F1qE61yDloe1ocRX-QWBZFq5TYmf3j2p5okRUPYxh427zYjpv9LBfwFqxtGeP6Uy7WW4JdI5S8F82rCeZsMknNxEfjMt1mNxOdgwBqcrtipb3gqAMURE5PA/?imgmax=800"
              alt="Church community"
              borderRadius="lg"
              boxShadow="lg"
              {...imageHover}
            />
          </SimpleGrid>
        </MotionBox>

        <Separator my={12}  />

        {/* Call to Action */}
        <MotionBox custom={4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box textAlign="center" pt={10}>
            <Text fontSize="2xl" fontWeight="bold">
              Come visit us and be part of a growing spiritual family!
            </Text>
          </Box>
        </MotionBox>
      </Stack>
    </Box>
  );
}
