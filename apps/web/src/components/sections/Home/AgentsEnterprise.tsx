"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const items = [
  {
    title: "Maximize Your Income",
    description: "Unlock higher earnings by maximizing your property's potential with our platform.",
    imageSrc: "/assets/images/agents-enterprise/agent-1.svg",
    bgColor: "#F9F9ED",
  },
  {
    title: "Inspection Fee (Optional)",
    description: "Set an inspection fee and let renters pay before contacting you or scheduling inspections.",
    imageSrc: "/assets/images/agents-enterprise/agent-2.svg",
    bgColor: "#F5FCF6",
  },
  {
    title: "Effortless Property Listing",
    description: "Showcase your property in minutes and reach the right renters through a seamless listing flow.",
    imageSrc: "/assets/images/agents-enterprise/agent-3.svg",
    bgColor: "#F9F5FE",
  },
  {
    title: "Exclusive Complimentary Website",
    description: "Get a branded website with a booking engine where clients can schedule inspections or reservations.",
    imageSrc: "/assets/images/agents-enterprise/agent-4.svg",
    bgColor: "#FDF7F1",
  },
];

export function AgentsEnterprise() {
  return (
    <div id="agents-enterprise">
      <section className="max-w-[1400px] mx-auto bg-white relative px-4 sm:px-6 md:px-12 mt-12 sm:mt-16 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10 md:gap-20 mt-12 justify-between">
          <div className="relative md:min-h-[400vh]">
            <div className="md:fixed md:top-1/2 md:-translate-y-1/2 md:w-[calc((100vw-1400px)/2+700px-3rem)] md:max-w-[700px]">
              <motion.div
                className="flex flex-col items-start text-left max-w-3xl mx-auto md:mx-0 mb-8 md:mb-0 gap-4"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="sm:block bg-brand-50 px-3 py-2 w-max max-w-full rounded-full">
                  <p className="text-brand-700 text-xs md:text-sm text-center font-semibold">
                    Hospitality businesses, rental agents & property owners
                  </p>
                </div>
                <h3 className="max-w-xl text-[32px] sm:text-[48px] font-display font-bold text-slate-900 leading-[34px] sm:leading-[58px] tracking-[-1.28px] sm:tracking-[-2px]">
                  Agents, Hosts &amp; Enterprises
                </h3>
                <p className="text-slate-600 text-base sm:text-[20px] leading-[24px] sm:leading-[30px] md:pr-10">
                  Whether you are a property owner, a rental agent, or a hospitality business, GIGS lets you manage your
                  portfolio, list properties, and earn with ease.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 pb-24 md:pb-32">
            {items.map((item, index) => (
              <motion.section
                key={item.title}
                className={`${index === items.length - 1 ? "mb-0" : "mb-24"}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className={`mb-6 px-6 md:px-16 flex justify-center rounded-3xl w-full pt-16 overflow-hidden bg-cover bg-center relative`}
                  style={{
                    backgroundColor: item.bgColor,
                    backgroundImage: "url('/assets/images/agents-enterprise/noise.svg')",
                  }}
                >
                  <Image
                    alt="illustration"
                    src={item.imageSrc}
                    width={280}
                    height={560}
                    priority={index === 0}
                    className="select-none w-auto h-auto max-w-full"
                    style={{ height: "auto" }}
                  />
                </div>

                <div>
                  <h3 className="text-slate-900 text-[20px] sm:text-[24px] font-display font-bold tracking-[-1px]">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-base sm:text-xl mt-3 font-normal">{item.description}</p>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
