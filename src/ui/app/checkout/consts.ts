export const masterFields = [
  {
    id: 1,
    fieldName: "content",
    label: "Write content for your post",
    type: "multiline",
    max: 280,
    placeholder: "Type Content here...",
    minSpan: 12,
  },
  {
    id: 2,
    fieldName: "publishDate",
    label: "Choose Date to publish this post",
    type: "date",
    placeholder: "Choose Date",
    minSpan: 6,
  },
  {
    id: 3,
    fieldName: "publishTime",
    label: "Choose Time to publish this post",
    type: "time",
    placeholder: "Choose Time",
    minSpan: 6,
  },
  {
    id: 4,
    fieldName: "instructions",
    label: "Add Instructions",
    type: "multiline",
    placeholder: "If you have instructions, please type them here.",
    minSpan: 12,
    max: 1000,
  },
  {
    id: 5,
    fieldName: "link",
    label: "Enter Link",
    placeholder: "Enter Link",
    type: "text",
    minSpan: 6,
  },
  {
    id: 6,
    fieldName: "endDate",
    label: "Choose End Date for Pinned Tweet",
    type: "date",
    placeholder: "Choose Date",
    minSpan: 6,
  },
];

export const formFields = [
  {
    serviceName: "Post",
    fields: [
      // Content, Date, Time, Instructions
      {
        masterFieldId: 1,
        required: true,
      },
      {
        masterFieldId: 2,
        required: false,
      },
      {
        masterFieldId: 3,
        required: false,
      },
      {
        masterFieldId: 4,
        required: false,
      },
    ],
  },
  {
    serviceName: "Repost",
    fields: [
      // Link, Date, Time
      {
        masterFieldId: 5,
        required: true,
      },
      {
        masterFieldId: 2,
        required: false,
      },
      {
        masterFieldId: 3,
        required: false,
      },
    ],
  },
  {
    serviceName: "Reply",
    fields: [
      // Link Content, Date, Time, Instructions
      {
        masterFieldId: 5,
        required: true,
      },
      {
        masterFieldId: 1,
        required: true,
      },
      {
        masterFieldId: 2,
        required: false,
      },
      {
        masterFieldId: 3,
        required: false,
      },
      {
        masterFieldId: 4,
        required: false,
      },
    ],
  },
  {
    serviceName: "Pinned Tweet",
    fields: [
      // Link, Date, End Date
      {
        masterFieldId: 5,
        required: true,
      },
      {
        masterFieldId: 2,
        required: true,
      },
      {
        masterFieldId: 6,
        required: true,
      },
    ],
  },
  {
    serviceName: "Like",
    // Link ,Date, Time
    fields: [
      {
        masterFieldId: 5,
        required: true,
      },
      {
        masterFieldId: 2,
        required: false,
      },
      {
        masterFieldId: 3,
        required: false,
      },
    ],
  },
  {
    serviceName: "Quote a Post",
    fields: [
      // Link, Content, Date, Time, Instructions
      {
        masterFieldId: 5,
        required: true,
      },
      {
        masterFieldId: 1,
        required: true,
      },
      {
        masterFieldId: 2,
        required: false,
      },
      {
        masterFieldId: 3,
        required: false,
      },
      {
        masterFieldId: 4,
        required: false,
      },
    ],
  },
];

export const checkedOutServices = [
  {
    serviceItem: {
      id: "fdf364d2-5eff-4eb0-9762-1ed8805a5ef6",
      service_master: {
        id: "31eacd8a-9b20-45ce-9bb6-32dad068e412",
        name: "Post",
        description: "Post",
        limit: "1",
        type: "standard",
        created_at: "2023-12-20T12:48:51.258912Z",
        deleted_at: null,
        is_duration_based: false,
      },
      package: {
        id: "ef40fec7-3f01-4cc3-af94-d746cba1dcdf",
        name: "Post (Content)",
        description:
          "Post (Content provided by Business)Post (Content provided by Business)",
        status: "published",
        publish_date: "2023-12-21T09:10:02.986000Z",
        created_at: "2023-12-21T09:09:49.404252Z",
        deleted_at: null,
        type: "service",
        influencer: "7db926db-9515-4239-b507-5d36a913087f",
      },
      currency: {
        id: "502a3757-4b1b-42f3-aae6-3deff22b22d9",
        name: "Solana",
        symbol: "SOL",
        country: {
          id: "8be9c48b-c0e4-47aa-ba80-30474a75c560",
          name: "india",
          country_code: "ind",
        },
      },
      quantity: null,
      price: "1000.00",
      platform_fees: "5.00",
      status: "published",
      created_at: "2023-12-21T09:09:49.406406Z",
      deleted_at: null,
      platform_price: "1050",
    },
    quantity: 1,
    price: 1050,
  },
  {
    serviceItem: {
      id: "ea2b7f49-bc90-414d-b97f-d7078bdacd15",
      service_master: {
        id: "31eacd8a-9b20-45ce-9bb6-32dad068e412",
        name: "Post",
        description: "Post",
        limit: "1",
        type: "standard",
        created_at: "2023-12-20T12:48:51.258912Z",
        deleted_at: null,
        is_duration_based: false,
      },
      package: {
        id: "6f86f868-2545-49a0-98c6-e422991b86b0",
        name: "Post",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        status: "published",
        publish_date: "2023-12-21T07:36:15.254000Z",
        created_at: "2023-12-21T07:36:06.431794Z",
        deleted_at: null,
        type: "service",
        influencer: "7db926db-9515-4239-b507-5d36a913087f",
      },
      currency: {
        id: "502a3757-4b1b-42f3-aae6-3deff22b22d9",
        name: "Solana",
        symbol: "SOL",
        country: {
          id: "8be9c48b-c0e4-47aa-ba80-30474a75c560",
          name: "india",
          country_code: "ind",
        },
      },
      quantity: null,
      price: "1234.00",
      platform_fees: "5.00",
      status: "published",
      created_at: "2023-12-21T07:36:06.435504Z",
      deleted_at: null,
      platform_price: "1295.7",
    },
    quantity: 1,
    price: 1295.7,
  },
  {
    serviceItem: {
      id: "8db69a65-2127-45ab-8372-1a8982d52c8c",
      service_master: {
        id: "31eacd8a-9b20-45ce-9bb6-32dad068e412",
        name: "Post",
        description: "Post",
        limit: "1",
        type: "standard",
        created_at: "2023-12-20T12:48:51.258912Z",
        deleted_at: null,
        is_duration_based: false,
      },
      package: {
        id: "fdc80fcb-9647-427d-ba84-53d58816bcf3",
        name: "Post",
        description: "dasdsadas",
        status: "published",
        publish_date: "2023-12-21T05:32:49.304000Z",
        created_at: "2023-12-20T12:49:25.982006Z",
        deleted_at: null,
        type: "service",
        influencer: "7db926db-9515-4239-b507-5d36a913087f",
      },
      currency: {
        id: "502a3757-4b1b-42f3-aae6-3deff22b22d9",
        name: "Solana",
        symbol: "SOL",
        country: {
          id: "8be9c48b-c0e4-47aa-ba80-30474a75c560",
          name: "india",
          country_code: "ind",
        },
      },
      quantity: null,
      price: "1234.00",
      platform_fees: "5.00",
      status: "published",
      created_at: "2023-12-20T12:49:25.983519Z",
      deleted_at: null,
      platform_price: "1295.7",
    },
    quantity: 1,
    price: 1295.7,
  },
];
