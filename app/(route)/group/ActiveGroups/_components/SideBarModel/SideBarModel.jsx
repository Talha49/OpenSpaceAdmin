"use client";
import { FaPen, FaTimes, FaUserFriends } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const GroupDetailsPanel = ({
  isOpen,
  onClose,
  group,
  handleEditButtonClick,
}) => {
  const [activeSection, setActiveSection] = useState(null);

  console.log(group);

  return (
    <>
      {/* Frosted Glass Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 w-full max-w-md h-screen 
          bg-white/90 dark:bg-neutral-900/95 
          backdrop-blur-lg
          shadow-2xl 
          z-50 
          flex flex-col 
          overflow-hidden
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg">
          <div className="flex items-center space-x-4">
            <FaUserFriends className="text-2xl text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Group Details
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditButtonClick}
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-800 p-2 rounded-full transition-colors"
              aria-label="Edit Group"
            >
              <FaPen className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close Panel"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Group Overview */}
          <section className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              {group?.groupName}
            </h1>
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium tracking-wide">
              {group?.groupType}
            </span>
          </section>

          {/* Owners */}
          <section className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Group Owners
            </h3>
            <div className="flex flex-wrap gap-2">
              {group?.groupOwrnerID.map((owner) => (
                <Badge
                  key={owner._id}
                  text={owner.fullName}
                  image={owner?.image || "/images/avatar.png"}
                />
              ))}
            </div>
          </section>

          {/* Description */}
          <CollapsibleSection
            title="Description"
            isOpen={activeSection === "description"}
            onToggle={() =>
              setActiveSection(
                activeSection === "description" ? null : "description"
              )
            }
          >
            <p className="text-neutral-600 dark:text-neutral-400 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-b-xl">
              {group?.groupDescription || "No description available"}
            </p>
          </CollapsibleSection>

          {/* Members */}
          <CollapsibleSection
            title="Members"
            isOpen={activeSection === "members"}
            onToggle={() =>
              setActiveSection(activeSection === "members" ? null : "members")
            }
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {group?.groupTargetID.map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </>
  );
};

const Badge = ({ text, image }) => (
  <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-blue-100 dark:bg-neutral-700 text-blue-800 dark:text-blue-200 text-xs font-medium">
    <img src={image} alt="profile" className="w-6 h-6 rounded-full" />
    {text}
  </div>
);

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
    <div
      className={`
        flex items-center justify-between 
        px-4 py-3 
        bg-white dark:bg-neutral-900 
        cursor-pointer 
        hover:bg-neutral-50 dark:hover:bg-neutral-800 
        transition-colors
        ${isOpen ? "border-b" : ""}
      `}
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>
      <IoIosArrowDown
        className={`
          text-neutral-600 dark:text-neutral-400 
          transform transition-transform duration-300 
          ${isOpen ? "rotate-180" : ""}
        `}
      />
    </div>
    {isOpen && <div className="animate-fade-in">{children}</div>}
  </div>
);

const MemberCard = ({ member }) => (
  <div
    className="
    flex items-center justify-start gap-3
    p-3 
    bg-white dark:bg-neutral-800 
    border border-neutral-200 dark:border-neutral-700 
    rounded-lg 
    hover:bg-neutral-50 dark:hover:bg-neutral-700 
    transition-colors
  "
  >
    <img
      src={member?.image || "/images/avatar.png"}
      alt="profile"
      className="w-14 h-14 rounded-full"
    />
    <div className="flex flex-col">
      <p className="font-medium text-neutral-800 dark:text-neutral-200">
        {member.fullName}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {member.email}
      </p>
    </div>
  </div>
);

export default GroupDetailsPanel;
