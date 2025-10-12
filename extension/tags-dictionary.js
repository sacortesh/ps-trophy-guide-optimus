const TT_TAGS_DICTIONNARY = [
  {
    order: 2,
    description:
      'require a connection to live services, such as Xbox Live, for playing an online game mode, for sharing content, accessing leaderboards, or validating data with a server.',
    name: 'Online Game Mode',
    priority: 2000
  },
  {
    order: 1,
    description:
      'require play in game modes that do not necessitate a connection to any online services.',
    name: 'Offline Game Mode',
    priority: 0
  },
  {
    order: 3,
    description: 'can be obtained in either an online or offline game mode.',
    name: 'Online/Offline',
    priority: 0
  },
  {
    order: 4,
    description: 'can be obtained by a single player.',
    name: 'Single Player',
    priority: 0
  },
  {
    order: 9,
    description: 'are gained automatically by progressing through the main game modes.',
    name: 'Main Storyline',
    priority: 0
  },
  {
    order: 11,
    description: 'require that the game be played on a certain difficulty level.',
    name: 'Difficulty Specific',
    priority: 1500
  },
  {
    order: 12,
    description:
      'can be unlocked at the same time as, or in the course of, earning its more difficult or less difficult counterpart.',
    name: 'Stackable',
    priority: 1500
  },
  {
    order: 13,
    description: 'are obtained by exploring the game environment to find a set of unique objects.',
    name: 'Collectable',
    priority: 1000
  },
  {
    order: 14,
    description: 'are obtained by repeatedly performing the same action or set of actions over time.',
    name: 'Cumulative +',
    priority: 1000
  },
  {
    order: 19,
    description:
      'are obtained by contact with a player who meets the requirements for spreading it to others.',
    name: 'Viral',
    priority: 1250
  },
  {
    order: 20,
    description: 'require a certain TrueSkill rank or a certain position on a Leaderboard to be reached.',
    name: 'Online Skill',
    priority: 2500
  },
  {
    order: 25,
    description: 'require at least 20 hours of play time to obtain.',
    name: 'Time Consuming',
    priority: 1000
  },
  {
    order: 13,
    description: 'can be missed.',
    name: 'Missable',
    priority: 1500
  },
  {
    order: 27,
    description: 'may unlock after the requirements have been met or not at all.',
    name: 'Buggy -',
    priority: 1200
  },
  {
    order: 30,
    description: 'have never been possible to unlock legitimately.',
    name: 'Unobtainable',
    priority: 4000
  },
  {
    order: 29,
    description:
      'can no longer be obtained due to closed servers, a bad patch, or other unusual circumstances.',
    name: 'Discontinued',
    priority: 4000
  },
  {
    order: 18,
    description:
      'require the purchase of an item or a series of items as prerequisites from a shop.',
    name: 'Shop',
    priority: 1200
  },
  {
    order: 26,
    description: 'may unlock before the requirements have been met.',
    name: 'Buggy +',
    priority: 1100
  },
  {
    order: 17,
    description: 'must be obtained by levelling up in-game components.',
    name: 'Level',
    priority: 1100
  },
  {
    order: 8,
    description: 'can be unlocked by interactions with a community.',
    name: 'Community',
    priority: 1200
  },
  {
    order: 28,
    description:
      'may no longer be obtainable by players who have not already met specific requirements.',
    name: 'Partly Discontinued/Unobtainable',
    priority: 3500
  },
  {
    order: 23,
    description: 'cannot be earned during the initial playthrough.',
    name: 'Multiple Playthroughs Required',
    priority: 1100
  },
  {
    order: 15,
    description:
      'are obtained by repeatedly performing the same action or set of actions over time, but progress can diminish',
    name: 'Cumulative -',
    priority: 1500
  },
  {
    order: 5,
    description:
      'can be obtained by two or more players in a cooperative game mode who have met the achievement requirements.',
    name: 'Cooperative',
    priority: 2000
  },
  {
    order: 6,
    description:
      'can be obtained by two or more players in a face off gamemode who have met the achievement requirements.',
    name: 'Versus',
    priority: 2000
  },
  {
    order: 7,
    description: 'are only earned by the host or primary player.',
    name: 'Host Only',
    priority: 2000
  },
  {
    order: 24,
    description:
      'require content outside the game or input devices other than the system default.',
    name: 'External Content',
    priority: 3000
  },
  {
    order: 22,
    description:
      'require you to play the game or perform actions at certain times, within a time limit, or on specific dates.',
    name: 'Time/Date',
    priority: 3000
  },
  {
    order: 21,
    description: 'require a minimum number of participating players to attempt.',
    name: 'Players Required',
    priority: 2000
  },
  {
    order: 31,
    description: 'require you to obtain all other trophies within the base game.',
    name: 'Platinum',
    priority: 5000
  },
  {
    order: 10,
    description: 'are obtained upon completing the story within a game.',
    name: 'Story Completed',
    priority: 500
  }
];
