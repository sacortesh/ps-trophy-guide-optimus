const tags = [
  {
    name: "Story",
    priority: 0,
  },
  {
    name: "Unmissable",
    priority: 0,
  },
  {
    name: "Missable",
    priority: 200,
  },
  {
    name: "Stackable",
    priority: 200,
  },
  {
    name: "Buggy",
    priority: 150,
  },
  {
    name: "Unattainable",
    priority: 300,
  },
  {
    name: "DLC Required",
    priority: 150,
  },
  {
    name: "Difficulty Specific",
    priority: 200,
  },
  {
    name: "Date Sensitive",
    priority: 200,
  },
  {
    name: "Time Limited",
    priority: 200,
  },
  {
    name: "Grind",
    priority: 150,
  },
  {
    name: "Collectable",
    priority: 150,
  },
  {
    name: "Viral",
    priority: 100,
  },
  {
    name: "Co-Op or Solo",
    priority: 100,
  },
  {
    name: "Online Co-Op",
    priority: 300,
  },
  {
    name: "Offline Co-Op",
    priority: 150,
  },
  {
    name: "Multiplayer Only",
    priority: 200,
  },
  {
    name: "Online Required",
    priority: 300,
  },
  {
    name: "2 Controllers",
    priority: 150,
  },
  {
    name: "3 Controllers",
    priority: 150,
  },
  {
    name: "4 Controllers",
    priority: 150,
  },
  {
    name: "Move Required",
    priority: 150,
  },
  {
    name: "Camera Required",
    priority: 150,
  },
  {
    name: "Mic Required",
    priority: 150,
  },
  {
    name: "PS VR Required",
    priority: 150,
  },
  {
    name: "Other Peripheral",
    priority: 150,
  },
];

const getTagNames = () => {
  return tags.map((tag) => tag.name);
};

const getTagPriority = (name) => {
  const tag = tags.find((tag) => tag.name === name);
  if (tag) {
    return tag.priority;
  }
  return 0;
};

const getTagsPriority = (arrayOfTags) => {
    let result = 0;
    arrayOfTags.forEach(element => {
        result += getTagPriority(element);
    });
    return result;
  };

module.exports = {
  getTagNames: getTagNames,
  getTagPriority: getTagPriority,
  getTagsPriority: getTagsPriority,
};
