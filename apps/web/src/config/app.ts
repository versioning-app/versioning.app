export const appConfig = {
  name: 'versioning.app',
  // creator: 'Callum Morris',
  creator: 'versioning.app',
  url: 'https://versioning.app',
  links: {
    twitter: 'https://twitter.com/versioningapp',
    github: 'https://github.com/versioning-app',
    email: 'hello@versioning.app',
    mailto: 'mailto:hello@versioning.app',
  },
  organization: {
    creatorRole: String(
      process.env.NEXT_PUBLIC_CLERK_CREATOR_ROLE ?? 'org:admin'
    ),
  },
};
