import { initPlasmicLoader } from "@plasmicapp/loader-react";
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "hyV3Qh6omoZfLaxr2maQHq",  // ID of a project you are using
      token: "L1RFJkuUW63ez1epePzMXrZwvaKrpndiqdb5JdhLNcV479CYu0vD5DD5gjDauaTLIXIvVyMtx4IbyKqF3gw"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})
