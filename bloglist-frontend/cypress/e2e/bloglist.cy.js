describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3000/api/testing/reset");

    const user1 = {
      name: "Test User One",
      username: "testuser1",
      password: "password123",
    };
    const user2 = {
      name: "Test User Two",
      username: "testuser2",
      password: "password456",
    };

    cy.request("POST", "http://localhost:3000/api/users", user1);
    cy.request("POST", "http://localhost:3000/api/users", user2);

    cy.visit("http://localhost:9999");
  });

  it("Login form is shown", function () {
    cy.get("form").should("be.visible");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get('input[name="Username"]').type("testuser1");
      cy.get('input[name="Password"]').type("password123");
      cy.get('button[type="submit"]').click();

      cy.contains("Test User One logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get('input[name="Username"]').type("testuser1");
      cy.get('input[name="Password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      cy.contains("Wrong credentials")
        .should("be.visible")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get('input[name="Username"]').type("testuser1");
      cy.get('input[name="Password"]').type("password123");
      cy.get('button[type="submit"]').click();

      cy.contains("Test User One logged in");
    });

    it("A blog can be created", function () {
      cy.contains("Create a new blog").click();

      cy.get("form").should("be.visible");

      cy.get('input[name="title"]').type("Test Blog Title");
      cy.get('input[name="author"]').type("Test Author");
      cy.get('input[name="url"]').type("http://testblogurl.com");
      cy.get('button[type="submit"]').click();

      cy.contains("Test Blog Title");
      cy.contains("Test Author");
    });

    it("A user can like a blog", function () {
      cy.contains("Create a new blog").click();
      cy.get('input[name="title"]').type("Test Blog Title");
      cy.get('input[name="author"]').type("Test Author");
      cy.get('input[name="url"]').type("http://testblogurl.com");
      cy.get('button[type="submit"]').click();

      cy.contains("Test Blog Title");

      cy.contains("Test Blog Title").parent().contains("view").click();
      cy.contains("Test Blog Title").parent().contains("like").click();

      cy.contains("Test Blog Title").parent().should("contain", "1");
    });

    it("Only the creator can see the delete button", function () {
      cy.contains("Create a new blog").click();
      cy.get('input[name="title"]').type("Test Blog Title");
      cy.get('input[name="author"]').type("Test Author");
      cy.get('input[name="url"]').type("http://testblogurl.com");
      cy.get('button[type="submit"]').click();

      cy.contains("Test Blog Title");

      cy.contains("Test Blog Title").parent().contains("view").click();
      cy.contains("Test Blog Title")
        .parent()
        .contains("Delete")
        .should("be.visible");

      cy.contains("logout").click();

      cy.get('input[name="Username"]').type("testuser2");
      cy.get('input[name="Password"]').type("password456");
      cy.get('button[type="submit"]').click();
      cy.contains("Test User Two logged in");

      cy.contains("Test Blog Title").parent().contains("view").click();
      cy.contains("Test Blog Title").parent().should("not.contain", "Delete");
    });
    it("Blogs are ordered by likes", function () {
      
      const blogs = [
        {
          title: "Blog A",
          author: "Author A",
          url: "http://bloga.com",
          likes: 2,
        },
        {
          title: "Blog B",
          author: "Author B",
          url: "http://blogb.com",
          likes: 3,
        },
        {
          title: "Blog C",
          author: "Author C",
          url: "http://blogc.com",
          likes: 4,
        },
      ];

      blogs.forEach((blog) => {
        cy.contains("Create a new blog").click();
        cy.get('input[name="title"]').type(blog.title);
        cy.get('input[name="author"]').type(blog.author);
        cy.get('input[name="url"]').type(blog.url);
        cy.get('button[type="submit"]').click();
        cy.contains("Cancel").click();
      });

      blogs.forEach((blog) => {
        cy.contains(blog.title).parent().as("blogContainer");
        cy.get("@blogContainer").contains("view").click();
        for (let i = 0; i < blog.likes; i++) {
          cy.get("@blogContainer").contains("like").click();

          cy.wait(500);
        }
      });

      cy.get(".blog").should("have.length", blogs.length);

      cy.get(".blog").then(($blogs) => {
        const blogElements = $blogs.toArray();

        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

        blogElements.forEach((element, index) => {
          const blogTitle = sortedBlogs[index].title;
          cy.wrap(element).should("contain", blogTitle);
        });
      });
    });
  });
});
