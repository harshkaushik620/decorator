// Define the User model class
enum UserRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Subscriber = "Subscriber",
}

class User {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: UserRole,
    address: string,
    middleName?: string
  ) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.address = address;
  }
}

// Define the CRUD interface
interface CRUD<T> {
  create(data: T): void;
  read(): T[];
  update(data: T): void;
  delete(id: string): void;
}

// Define the UserService class implementing the CRUD interface
class UserService implements CRUD<User> {
  private users: User[];

  constructor() {
    this.users = [];
  }

  create(user: User) {
    this.users.push(user);
  }

  read(): User[] {
    return this.users;
  }

  update(updatedUser: User) {
    const index = this.users.findIndex(
      (user) => user.email === updatedUser.email
    );
    if (index >= 0) {
      this.users[index] = updatedUser;
    }
  }

  delete(email: string) {
    const index = this.users.findIndex((user) => user.email === email);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
}

// Define a DateFormatter decorator
function DateFormatter(target: Object, propertyKey: string | symbol) {
  const originalMethod = target[propertyKey];

  target[propertyKey] = function (...args: any[]) {
    const result = originalMethod.apply(this, args);
    if (result instanceof Date) {
      return result.toLocaleString();
    }
    return result;
  };
}

// Initialize the UserService and render the table
const userService = new UserService();
userService.create(
  new User(
    "John",
    "Doe",
    "john.doe@example.com",
    "1234567890",
    UserRole.SuperAdmin,
    "123 Main St"
  )
);
userService.create(
  new User(
    "Jane",
    "Doe",
    "jane.doe@example.com",
    "0987654321",
    UserRole.Admin,
    "456 Oak Ave"
  )
);
userService.create(
  new User(
    "Bob",
    "Smith",
    "bob.smith@example.com",
    "5555555555",
    UserRole.Subscriber,
    "789 Maple Rd"
  )
);

function renderTable() {
  const table = document.createElement("table");

  // Add the table header row
  const headerRow = document.createElement("tr");
  const columns = [
    "First Name",
    "Middle Name",
    "Last Name",
    "Email",
    "Phone Number",
    "Role",
    "Address",
    "",
  ];
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add the table rows
  userService.read().forEach((user) => {
    const tr = document.createElement("tr");

    const firstNameTd = document.createElement("td");
    firstNameTd.textContent = user.firstName;
    tr.appendChild(firstNameTd);

    const middleNameTd = document.createElement("td");
    middleNameTd.textContent = user.middleName;
    tr.appendChild(middleNameTd);

    const lastNameTd = document.createElement("td");
    lastNameTd.textContent = user.lastName;
    tr.appendChild(lastNameTd);

    const emailTd = document.createElement("td");
    emailTd.textContent = user.email;
    tr.appendChild(emailTd);

    const phoneTd = document.createElement("td");
    phoneTd.textContent = user.phone;
    tr.appendChild(phoneTd);

    const roleTd = document.createElement("td");
    roleTd.textContent = user.role;
    tr.appendChild(roleTd);

    const addressTd = document.createElement("td");
    addressTd.textContent = user.address;
    tr.appendChild(addressTd);

    const editTd = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editUser(user, tr);
    });
    editTd.appendChild(editButton);
    tr.appendChild(editTd);

    table.appendChild(tr);
  });
  return table;
}
// Edit the user and update the table
function editUser(user: User, row: HTMLTableRowElement) {
  const firstNameInput = createInput(user.firstName);
  const middleNameInput = createInput(user.middleName);
  const lastNameInput = createInput(user.lastName);
  const emailInput = createInput(user.email);
  const phoneInput = createInput(user.phone);
  const roleInput = createSelectInput(Object.values(UserRole), user.role);
  const addressInput = createInput(user.address);
  row.innerHTML = "";
  row.appendChild(firstNameInput);
  row.appendChild(middleNameInput);
  row.appendChild(lastNameInput);
  row.appendChild(emailInput);
  row.appendChild(phoneInput);
  row.appendChild(roleInput);
  row.appendChild(addressInput);
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const updatedUser = new User(
      firstNameInput.value,
      lastNameInput.value,
      emailInput.value,
      phoneInput.value,
      roleInput.value as UserRole,
      addressInput.value,
      middleNameInput.value
    );
    userService.update(updatedUser);
    row.innerHTML = "";
    row.appendChild(createTextCell(updatedUser.firstName));
    row.appendChild(createTextCell(updatedUser.middleName));
    row.appendChild(createTextCell(updatedUser.lastName));
    row.appendChild(createTextCell(updatedUser.email));
    row.appendChild(createTextCell(updatedUser.phone));
    row.appendChild(createTextCell(updatedUser.role));
    row.appendChild(createTextCell(updatedUser.address));
    row.appendChild(createEditButton(updatedUser, row));
  });
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    row.innerHTML = "";
    row.appendChild(createTextCell(user.firstName));
    row.appendChild(createTextCell(user.middleName));
    row.appendChild(createTextCell(user.lastName));
    row.appendChild(createTextCell(user.email));
    row.appendChild(createTextCell(user.phone));
    row.appendChild(createTextCell(user.role));
    row.appendChild(createTextCell(user.address));
    row.appendChild(createEditButton(user, row));
  });
  row.appendChild(saveButton);
  row.appendChild(cancelButton);
}
// Helper functions to create table cells and inputs
function createTextCell(text: string) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}
function createInput(value: string) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  return input;
}
function createSelectInput(options: string[], selectedOption: string) {
  const select = document.createElement("select");
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    if (option === selectedOption) {
      optionElement.selected = true;
    }
    select.appendChild(optionElement);
  });
  return select;
}
function createEditButton(user: User, row: HTMLTableRowElement) {
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    editUser(user, row);
  });
  return editButton;
}
function createDeleteButton(user: User, row: HTMLTableRowElement) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    userService.delete(user);
    row.remove();
  });
  return deleteButton;
}
// Initialize the page
function init() {
  const loadDataButton = document.createElement("button");
  loadDataButton.textContent = "Load data";
  loadDataButton.addEventListener("click", () => {
    const table = createTable(userService.getAll());
    document.body.removeChild(loadDataButton);
    document.body.appendChild(table);
    const refreshDataButton = document.createElement("button");
    refreshDataButton.textContent = "Refresh data";
    refreshDataButton.addEventListener("click", () => {
      const newTable = createTable(userService.getAll());
      table.parentNode?.replaceChild(newTable, table);
      table = newTable;
    });

    document.body.appendChild(refreshDataButton);
  });
  document.body.appendChild(loadDataButton);
}
init();
