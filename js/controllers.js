function models_controller($scope, $http) {
    $scope.models = [];
    $scope.selected_model = undefined;

    $http.get('configs/models.json').success(function(data) {
        $scope.models = data;
        $scope.selected_model = $scope.models.length > 0 ? $scope.models[0] : undefined;
    });

    $scope.nothidden = function(input) {
        return input.hidden != true;
    }

    $scope.validation = {
        none: /.*/,
        mtu: /^1(4[6-9]\d|[5-9]\d{2})|[2-8]\d{3}|9([0-1]\d{2}|20\d|21[0-8])$/,
        ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    };
    $scope.validate = function(name) {
        return $scope.validation[name];
    }

    $scope.hosts = {
        new_host: '',
        new_address: '',
        remove: function($event, group, host) {
            this.new_host = host;
            this.new_address = group.values[host];
            delete group.values[host];
        },
        add: function($event, group) {
            group.values[this.new_host] = this.new_address;
            this.new_host = '';
            this.new_address = '';
        },
        command: function(host, address) {
            return host + ' ' + address;
        }
    }

    $scope.routes = {
        new_subnet: '',
        new_mask: '',
        new_gateway: '',
        remove: function($event, group, index) {
            this.new_subnet = group.values[index].subnet;
            this.new_mask = group.values[index].mask;
            this.new_gateway = group.values[index].gateway;
            group.values.splice(index, 1);
        },
        add: function($event, group) {
            group.values.push({subnet: this.new_subnet, mask: this.new_mask, gateway: this.new_gateway});
            this.new_subnet = '';
            this.new_mask = '';
            this.new_gateway = '';
        },
        command: function(subnet, mask, gateway) {
            return subnet + ' ' + mask + ' ' + gateway;
        }
    }

    $scope.stpdisable = {
        new_vlan: '',
        remove: function($event, group, index) {
            this.new_vlan = group.values[index];
            group.values.splice(index, 1);
        },
        add: function($event, group) {
            group.values.push(this.new_vlan);
            this.new_vlan = '';
        },
        command: function(vlan) {
            return vlan;
        }
    }

    $scope.servers = {
        new_server: '',
        remove: function($event, group, index) {
            this.new_server = group.values[index];
            group.values.splice(index, 1);
        },
        add: function($event, group) {
            group.values.push(this.new_server);
            this.new_server = '';
        },
        command: function(server) {
            return server;
        }
    }

    $scope.aliases = {
        new_context: '',
        new_name: '',
        new_command: '',
        remove: function($event, group, index) {
            this.new_context = group.values[index].context;
            this.new_name = group.values[index].name;
            this.new_command = group.values[index].command;
            delete group.values[index];
        },
        add: function($event, group) {
            group.values.push({context: this.new_context, name: this.new_name, command: this.new_command});
            this.new_context = '';
            this.new_name = '';
            this.new_command = '';
        },
        command: function(context, name, command) {
            return context + ' ' + name + ' ' + command;
        }
    }

    $scope.flatten = function(values) {
        return values.join('');
    }

    $scope.contexts = {
        switch: function(node, parent) {
            if (node.ios_context && parent.ios_context) {
                return scgen.command(parent.indent||0, parent.ios_context, node.switch_context, node.switch_context_params, false)
            }
        },
        exit: function(node, parent) {
            if (node.ios_context && parent.ios_context && node.ios_context != parent.ios_context) {
                return scgen.command(node.indent||parent.indent||0, 'superglobal', 'exit', undefined, false);
            }
        }
    }

}
//models_controller.$inject = ['$scope', '$http'];

