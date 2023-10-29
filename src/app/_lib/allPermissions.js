export default {
  organizations: {
    "create:organization": {
      title: "Create Organization",
      description: "Create new organizations",
      scopes: []
    },
    "assign:organization": {
      title: "Assign Organization",
      description: "Assign organizations to users",
      scopes: ["organization"]
    }
  },
  users: {
    "create:user": {
      title: "Create User",
      description: "Create new users",
      scopes: ["organization"]
    },
    "update:user": {
      title: "Update User",
      description: "Update existing users",
      scopes: ["organization"]
    },
    "delete:user": {
      title: "Delete User",
      description: "Delete existing users",
      scopes: ["organization"]
    }
  },
  locations: {
    "create:location": {
      title: "Create Location",
      description: "Create new locations",
      scopes: []
    },
    "update:location": {
      title: "Update Location",
      description: "Update existing locations",
      scopes: ["location"]
    },
    "delete:location": {
      title: "Delete Location",
      description: "Delete existing locations",
      scopes: ["location"]
    }
  },
  racks: {
    "create:rack": {
      title: "Create Rack",
      description: "Create new racks",
      scopes: ["location"]
    },
    "update:rack": {
      title: "Update Rack",
      description: "Update existing racks",
      scopes: ["location", "rack"]
    },
    "delete:rack": {
      title: "Delete Rack",
      description: "Delete existing racks",
      scopes: ["location", "rack"]
    }
  },
  rackUnit: {
    "assign:rackUnit": {
      title: "Assign Rack Unit",
      description: "Assign devices to rack units",
      scopes: ["location", "rack", "rackUnit"]
    }
  },
  rackAgent: {
    "create:rackAgent": {
      title: "Create Rack Agent",
      description: "Create a new rack agent",
      scopes: ["location", "rack"]
    }
  },
  switch: {
    "create:switch": {
      title: "Create Switch",
      description: "Create new switches",
      scopes: ["location", "rack"]
    },
    "update:switch": {
      title: "Update Switch",
      description: "Update existing switches",
      scopes: ["location", "rack", "switch"]
    },
    "delete:switch": {
      title: "Delete Switch",
      description: "Delete existing switches",
      scopes: ["location", "rack", "switch"]
    }
  },
  physicalServer: {
    "create:physicalServer": {
      title: "Create Physical Server",
      description: "Create new physical servers",
      scopes: ["location", "rack"]
    },
    "rename:physicalServer": {
      title: "Renames Physical Server",
      description: "Renames existing physical servers",
      scopes: ["location", "rack", "physicalServer"]
    },
    "power-actions:physicalServer": {
      title: "Power actions",
      description: "Change the power state of the server",
      scopes: ["location", "rack", "physicalServer"]
    },
    "console:physicalServer": {
      title: "Console access",
      description: "Access the console to the server",
      scopes: ["location", "rack", "physicalServer"]
    },
    "images:physicalServer": {
      title: "Image management",
      description: "Add/Remove images to the server",
      scopes: ["location", "rack", "physicalServer"]
    },
    "iso:physicalServer": {
      title: "ISO Management",
      description: "Add/Remove ISO images to the server",
      scopes: ["location", "rack", "physicalServer"]
    },
    "update:physicalServer": {
      title: "Update Physical Server",
      description: "Update existing physical servers configuration",
      scopes: ["location", "rack", "physicalServer"]
    }
  },
  pdu: {

  }
}