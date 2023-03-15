// Define the User model class
var UserRole;
(function (UserRole) {
    UserRole["SuperAdmin"] = "SuperAdmin";
    UserRole["Admin"] = "Admin";
    UserRole["Subscriber"] = "Subscriber";
})(UserRole || (UserRole = {}));
var User = /** @class */ (function () {
    function User(firstName, lastName, email, phone, role, address, middleName) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
    }
    return User;
}());
// Define the UserService class implementing the CRUD interface
var UserService = /** @class */ (function () {
    function UserService() {
        this.users = [];
    }
    UserService.prototype.create = function (user) {
        this.users.push(user);
    };
    UserService.prototype.read = function () {
        return this.users;
    };
    UserService.prototype.update = function (updatedUser) {
        var index = this.users.findIndex(function (user) { return user.email === updatedUser.email; });
        if (index >= 0) {
            this.users[index] = updatedUser;
        }
    };
    UserService.prototype["delete"] = function (email) {
        var index = this.users.findIndex(function (user) { return user.email === email; });
        if (index >= 0) {
            this.users.splice(index, 1);
        }
    };
    return UserService;
}());
// Define a DateFormatter decorator
function DateFormatter(target, propertyKey) {
    var originalMethod = target[propertyKey];
    target[propertyKey] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = originalMethod.apply(this, args);
        if (result instanceof Date) {
            return result.toLocaleString();
        }
        return result;
    };
}
// Initialize the UserService and render the table
var userService = new UserService();
userService.create(new User("John", "Doe", "john.doe@example.com", "1234567890", UserRole.SuperAdmin, "123 Main St"));
userService.create(new User("Jane", "Doe", "jane.doe@example.com", "0987654321", UserRole.Admin, "456 Oak Ave"));
userService.create(new User("Bob", "Smith", "bob.smith@example.com", "5555555555", UserRole.Subscriber, "789 Maple Rd"));
function renderTable() {
    var table = document.createElement("table");
    // Add the table header row
    var headerRow = document.createElement("tr");
    var columns = [
        "First Name",
        "Middle Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Role",
        "Address",
        "",
    ];
    columns.forEach(function (column) {
        var th = document.createElement("th");
        th.textContent = column;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    // Add the table rows
    userService.read().forEach(function (user) {
        var tr = document.createElement("tr");
        var firstNameTd = document.createElement("td");
        firstNameTd.textContent = user.firstName;
        tr.appendChild(firstNameTd);
        var middleNameTd = document.createElement("td");
        middleNameTd.textContent = user.middleName;
        tr.appendChild(middleNameTd);
        var lastNameTd = document.createElement("td");
        lastNameTd.textContent = user.lastName;
        tr.appendChild(lastNameTd);
        var emailTd = document.createElement("td");
        emailTd.textContent = user.email;
        tr.appendChild(emailTd);
        var phoneTd = document.createElement("td");
        phoneTd.textContent = user.phone;
        tr.appendChild(phoneTd);
        var roleTd = document.createElement("td");
        roleTd.textContent = user.role;
        tr.appendChild(roleTd);
        var addressTd = document.createElement("td");
        addressTd.textContent = user.address;
        tr.appendChild(addressTd);
        var editTd = document.createElement("td");
        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            editUser(user, tr);
        });
        editTd.appendChild(editButton);
        tr.appendChild(editTd);
        table.appendChild(tr);
    });
    return table;
}
// Edit the user and update the table
function editUser(user, row) {
    var firstNameInput = createInput(user.firstName);
    var middleNameInput = createInput(user.middleName);
    var lastNameInput = createInput(user.lastName);
    var emailInput = createInput(user.email);
    var phoneInput = createInput(user.phone);
    var roleInput = createSelectInput(Object.values(UserRole), user.role);
    var addressInput = createInput(user.address);
    row.innerHTML = "";
    row.appendChild(firstNameInput);
    row.appendChild(middleNameInput);
    row.appendChild(lastNameInput);
    row.appendChild(emailInput);
    row.appendChild(phoneInput);
    row.appendChild(roleInput);
    row.appendChild(addressInput);
    var saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", function () {
        var updatedUser = new User(firstNameInput.value, lastNameInput.value, emailInput.value, phoneInput.value, roleInput.value, addressInput.value, middleNameInput.value);
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
    var cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function () {
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
function createTextCell(text) {
    var td = document.createElement("td");
    td.textContent = text;
    return td;
}
function createInput(value) {
    var input = document.createElement("input");
    input.type = "text";
    input.value = value;
    return input;
}
function createSelectInput(options, selectedOption) {
    var select = document.createElement("select");
    options.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === selectedOption) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
    return select;
}
function createEditButton(user, row) {
    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
        editUser(user, row);
    });
    return editButton;
}
function createDeleteButton(user, row) {
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        userService["delete"](user);
        row.remove();
    });
    return deleteButton;
}
// Initialize the page
function init() {
    var loadDataButton = document.createElement("button");
    loadDataButton.textContent = "Load data";
    loadDataButton.addEventListener("click", function () {
        var table = createTable(userService.getAll());
        document.body.removeChild(loadDataButton);
        document.body.appendChild(table);
        var refreshDataButton = document.createElement("button");
        refreshDataButton.textContent = "Refresh data";
        refreshDataButton.addEventListener("click", function () {
            var _a;
            var newTable = createTable(userService.getAll());
            (_a = table.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newTable, table);
            table = newTable;
        });
        document.body.appendChild(refreshDataButton);
    });
    document.body.appendChild(loadDataButton);
}
init();
