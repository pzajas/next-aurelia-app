import { motion } from "framer-motion";

export default function CinematicManifesto() {
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-[30vh] bg-background flex flex-col justify-center">
      <div className="container mx-auto px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.3 }}
          className="font-serif italic text-[6vw] md:text-[8vw] leading-[1.1] text-foreground"
        >
          <motion.div variants={lineVariants} transition={{ duration: 1 }}>
            The most radical
          </motion.div>
          <motion.div variants={lineVariants} transition={{ duration: 1 }} className="ml-[10vw]">
            thing you can do
          </motion.div>
          <motion.div variants={lineVariants} transition={{ duration: 1 }} className="ml-[25vw]">
            is change.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
