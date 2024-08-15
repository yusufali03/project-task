const YOUR_API_KEY = "727dc9655ddaf6548fcba0d55b7b9eabb68e23b1";

async function createPerson(jobData) {
  const response = await fetch(
    `https://api.pipedrive.com/v1/persons?api_token=${YOUR_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${jobData.firstName} ${jobData.lastName}`,
        phone: jobData.phone,
        email: jobData.email,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    return data.data.id; // person_id
  } else {
    console.error("Error creating person:", data);
    throw new Error("Could not create person");
  }
}
async function createOrganization(jobData) {
  const response = await fetch(
    `https://api.pipedrive.com/v1/organizations?api_token=${YOUR_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: jobData.address, // or any other relevant data
        address: jobData.address,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    return data.data.id; // org_id
  } else {
    console.error("Error creating organization:", data);
    throw new Error("Could not create organization");
  }
}

const jobForm = document.getElementById("jobForm");

jobForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Gather input data
  const jobData = {
    title: `${document.getElementById("jobType").value} - ${
      document.getElementById("firstName").value
    } ${document.getElementById("lastName").value}`,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zipCode: document.getElementById("zipCode").value,
    area: document.getElementById("area").value,
    startDate: document.getElementById("startDate").value,
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
    jobDescription: document.getElementById("jobDescription").value,
    jobSource: document.getElementById("jobSource").value,
  };

  try {
    // Create a new person and get the person_id
    const personId = await createPerson(jobData);

    // Optional: Create a new organization and get the org_id
    const orgId = await createOrganization(jobData);

    const response = await fetch(
      `https://api.pipedrive.com/v1/deals?api_token=${YOUR_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobData.title,
          person_id: personId, // Use the created person_id
          org_id: orgId, // Use the created org_id
          visible_to: 1,
          add_time: jobData.startDate + " " + jobData.startTime,
          custom_fields: {
            job_type: jobData.jobType,
            job_source: jobData.jobSource,
            job_description: jobData.jobDescription,
            address: jobData.address,
            city: jobData.city,
            state: jobData.state,
            zip_code: jobData.zipCode,
            area: jobData.area,
            start_date: jobData.startDate,
            start_time: jobData.startTime,
            end_time: jobData.endTime,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Job created successfully!");
      jobForm.reset(); // Clear form fields
    } else {
      console.error("Error:", data);
      alert("Error creating job.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error creating job.");
  }
});
