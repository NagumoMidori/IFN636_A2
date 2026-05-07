**IFN636: Software Life Cycle Management: *Template***

**Assessment 2**

Total Marks 35

**Assessment name:** Software development, testing and configuration

**We have provided this template for you. Include all parts of this assessment in one file (this file) and then submit it via Canvas before the deadline. (You can submit either PDF)**

**The first page (this page: cover page) of your assessment file should include following information:**

**Mark Distribution: Marks**

- SRS documentation 4

- Design Pattern and OOP Principles 6

- API Testing 2.5

- Functional Testing 2.5

- CI/CD Pipeline 4

- Load Balancing, and Load Testing 6

- Team Collaboration 5

- Report 5

Total Marks: 35

Your final mark will depend on your demonstration, which will be used to verify the functionality, completeness, and your understanding of the implemented system. During the demonstration, you will be required to clearly show how your project works and explain the key features and design decisions.

In addition, the use of Gen-AI tools must be clearly reported in your report. If you have used any Gen-AI tools during the development of your project (e.g., drawing diagram, design and design ideas, documentation, or debugging), you must include a section explaining how and where Gen-AI was used. Failure to report the use of Gen-AI may be considered a breach of academic integrity requirements.

**Project Title: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Full names: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Student IDs: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Tutor’s full name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Tutorial day and time: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

## IFN636 – Team Agreement Sheet for Assessment 2

**Project Title:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Team Name (if any):** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Tutorial Group:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Tutor Name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### Team Agreement

We, the undersigned team members, confirm that the information provided in this team agreement sheet accurately reflects each member’s contribution to this project. We understand that individual marks for Assessment 2 may be adjusted based on this agreement and tutor evaluation.

Each member also agrees to:

- Communicate regularly and respectfully within the team.

- Complete assigned tasks on time.

- Attend team meetings and participate actively.

- Address any conflicts through discussion and tutor guidance if needed.

### Team Members and Contribution (Variation in contribution will affect final marks)

| Student Name (Full) | Student ID | Role / Tasks Undertaken | Contribution (%) | Signature |
|---------------------|------------|-------------------------|------------------|-----------|
|                     |            |                         |                  |           |
|                     |            |                         |                  |           |
|                     |            |                         |                  |           |
|                     |            |                         |                  |           |
|                     |            |                         |                  |           |
|                     |            |                         |                  |           |

Total contribution must add up to **100%**

GitHub Link: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

EC2 Instance ID and Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**(Please make sure your links are working to avoid negative marking)**

# 

# SRS Documentation

> 1.1 Project Overview and Purpose
>
> Provide a brief overview of your project, including the application name, its core purpose, and the problem it aims to solve. Describe the main functionality and the intended users of the system.
>
> 1.2 Problem Statement and Scope
>
> Clearly define the problem your application addresses. Specify what is included within the project scope and what is explicitly excluded. Keep this concise and focused.
>
> 1.3 User Characteristics
>
> Describe the intended users of your system (e.g., teachers, students, administrators). Include their technical proficiency, roles, and any other relevant characteristics that influenced your design.
>
> 1.4 Constraints
>
> List any technical, business, or regulatory constraints that limit the design or implementation of your system.
>
> 1.5 Functional Requirements
>
> List the functional requirements of your system. Each requirement should describe a specific behaviour or function the system must perform. Use the format: "The system shall..." and number each requirement (e.g., FR-01: Login, FR-02: Registration).
>
> 1.6 Non-Functional Requirements (NFRs)
>
> List the non-functional requirements such as performance, security, usability, reliability, and maintainability. Quantify these where possible (e.g., "The system shall respond to requests within 2 seconds under normal load").
>
> 1.7 User interface mockups/wireframes (Low Fidelity Design)
>
> Provide low-fidelity wireframes or sketches for the key screens of your application. Include at minimum: the main/home page, a data entry/form screen, and any dashboard or results screen. Label all UI elements.
>
> 1.8 Complete System Diagram
>
> Provide a complete system architecture diagram showing all components (frontend, backend, GitHub, database, cloud services (EC2, Load balancer), and any external APIs) and how they interact. Use clear labels and directional arrows to show data flow.

# 2. Implementation and Design Pattern

> 2.1 Design pattern (At least five design patterns you must implement)
>
> Include specific backend code (screen shot) for the design pattern and provide your justification for choosing that design pattern.
>
> 2.2 Implementation of OOP
>
> Include specific backend code (screen shot) for the OOP concepts and provide your justifications for each OOP principle.

# 3. API Testing 

> API Request Collections and Response for Backend Code (Provide screenshot)

# 4. Functional Testing 

# Provide a pass / fail screenshot from the terminal for each of your backend functionality (such as create task, update task, etc.).

> 5\. CI/CD Pipeline Setup
>
> 5.1 Provide workflow file (YML) screenshot.

## 5.2 Provide a screenshot of EC2 server configuration (Only include pm2 status output table from the terminal).

## 5.3 Provide a screenshot of the “Run Test” page from GitHub (where the job is running, and you can see the steps are passing or failing).

## 5.4 Provide a screenshot of the first page of your application from the browser, highlighting the **public IP.**

> 6\. Load Balancing and Load Testing
>
> 6.1 Load Balancer Setup
>
> Deploy your application on two separate EC2 instances and configure an AWS Application Load Balancer (ALB) to distribute traffic between them. Provide the following evidence:
>
> \(a\) Screenshot of both EC2 instances in the Running state (from the AWS EC2 Instances console).
>
> \(b\) Screenshot of the Target Group showing both instances registered and healthy (Status: healthy).
>
> \(c\) Screenshot of the Application Load Balancer in the Active state, showing its DNS name.
>
> \(d\) Screenshot confirming traffic distribution: access the ALB DNS in a browser (or use curl) multiple times and capture responses alternating between the two server instances.
>
> 6.2 Load Testing and Performance Analysis
>
> Conduct load testing on your application using interpret the results. You must run at least two tests with different concurrency/request settings and compare outcomes:
>
> \(a\) Screenshot of the Apache Benchmark output for a baseline test. Identify and explain key metrics: Requests per second, Time per request, and Failed requests.
>
> \(b\) Screenshot of a second load test with higher concurrency or request count. Compare results with the baseline and explain any differences observed.
>
> \(c\) Screenshot of CloudWatch Metrics showing the CPU utilisation spike during load testing and any subsequent events that were triggered.
>
> \(d\) Brief written analysis (3–5 sentences): Explain how the load balancer distributed traffic, system responded to increased load, demonstration about application reliability and cost-effectiveness in a cloud environment.

# 7. Team Collaboration

> 7.1 Team collaboration statement
>
> 7.2 Team collaboration evidence
>
> Include evidence of commit history (you can see the graph view of commits from GitHub), feature branches, pull requests, and merge conflicts. Team Meeting times and dates should be included in this section. Team communication channel screen shot.

# 8. Discussion and Conclusion

> *Add discussion on the development process and write conclusion of your project*

# 9. Reflection

> *Add a reflection like what did you learn and what difficulties you have faced during the process.*

# References:

> Please use APA referencing style, more details about referencing can be found here: <https://qutvirtual4.qut.edu.au/group/student/study/writing-and-referencing/citing-and-referencing>
