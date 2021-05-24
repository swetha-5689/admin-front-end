const filterConfig = [
    {
      label: "Shifts",
      value: "shifts",
      children: [
        {
          label: "Confirmed",
          value: "slot"
        },
        {
          label: "Canceled",
          value: "canceled"
        }
      ],
    },
    { label: "Requests", value: "requests", children: [
      {
        label: "Approved",
        value: "approve"
      },
      {
        label: "Rejected",
        value: "reject"
      },
      {
        label: "Pending",
        value: "priority"
      }
    ] },
  ];
export default filterConfig;