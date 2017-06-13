///<reference path="../headers/common.d.ts" />
///<reference path="./mod_defs.d.ts" />
System.register(["./directives/dash_class", "./directives/confirm_click", "./directives/dash_edit_link", "./directives/dropdown_typeahead", "./directives/metric_segment", "./directives/misc", "./directives/ng_model_on_blur", "./directives/password_strength", "./directives/spectrum_picker", "./directives/tags", "./directives/value_select_dropdown", "./directives/plugin_component", "./directives/rebuild_on_change", "./directives/give_focus", "./directives/diff-view", "./jquery_extended", "./partials", "./components/jsontree/jsontree", "./components/grafana_app", "./components/sidemenu/sidemenu", "./components/search/search", "./components/info_popover", "./components/colorpicker", "./components/navbar/navbar", "./directives/array_join", "./live/live_srv", "./utils/emitter", "./components/layout_selector/layout_selector", "./components/switch", "./components/dashboard_selector", "./components/query_part/query_part_editor", "./components/wizard/wizard", "app/core/controllers/all", "app/core/services/all", "app/core/routes/routes", "./filters/filters", "./core_module", "./app_events", "./utils/colors", "./utils/model_utils", "./services/context_srv", "./services/keybindingSrv", "./components/help/help", "./nav_model_srv"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var grafana_app_1, sidemenu_1, search_1, info_popover_1, colorpicker_1, navbar_1, array_join_1, live_srv_1, emitter_1, layout_selector_1, switch_1, dashboard_selector_1, query_part_editor_1, wizard_1, core_module_1, app_events_1, colors_1, model_utils_1, context_srv_1, keybindingSrv_1, help_1, nav_model_srv_1;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            },
            function (_17) {
            },
            function (_18) {
            },
            function (grafana_app_1_1) {
                grafana_app_1 = grafana_app_1_1;
            },
            function (sidemenu_1_1) {
                sidemenu_1 = sidemenu_1_1;
            },
            function (search_1_1) {
                search_1 = search_1_1;
            },
            function (info_popover_1_1) {
                info_popover_1 = info_popover_1_1;
            },
            function (colorpicker_1_1) {
                colorpicker_1 = colorpicker_1_1;
            },
            function (navbar_1_1) {
                navbar_1 = navbar_1_1;
            },
            function (array_join_1_1) {
                array_join_1 = array_join_1_1;
            },
            function (live_srv_1_1) {
                live_srv_1 = live_srv_1_1;
            },
            function (emitter_1_1) {
                emitter_1 = emitter_1_1;
            },
            function (layout_selector_1_1) {
                layout_selector_1 = layout_selector_1_1;
            },
            function (switch_1_1) {
                switch_1 = switch_1_1;
            },
            function (dashboard_selector_1_1) {
                dashboard_selector_1 = dashboard_selector_1_1;
            },
            function (query_part_editor_1_1) {
                query_part_editor_1 = query_part_editor_1_1;
            },
            function (wizard_1_1) {
                wizard_1 = wizard_1_1;
            },
            function (_19) {
            },
            function (_20) {
            },
            function (_21) {
            },
            function (_22) {
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            },
            function (colors_1_1) {
                colors_1 = colors_1_1;
            },
            function (model_utils_1_1) {
                model_utils_1 = model_utils_1_1;
            },
            function (context_srv_1_1) {
                context_srv_1 = context_srv_1_1;
            },
            function (keybindingSrv_1_1) {
                keybindingSrv_1 = keybindingSrv_1_1;
            },
            function (help_1_1) {
                help_1 = help_1_1;
            },
            function (nav_model_srv_1_1) {
                nav_model_srv_1 = nav_model_srv_1_1;
            }
        ],
        execute: function () {///<reference path="../headers/common.d.ts" />
            ///<reference path="./mod_defs.d.ts" />
            exports_1("grafanaAppDirective", grafana_app_1.grafanaAppDirective);
            exports_1("sideMenuDirective", sidemenu_1.sideMenuDirective);
            exports_1("searchDirective", search_1.searchDirective);
            exports_1("infoPopover", info_popover_1.infoPopover);
            exports_1("colorPicker", colorpicker_1.colorPicker);
            exports_1("navbarDirective", navbar_1.navbarDirective);
            exports_1("arrayJoin", array_join_1.arrayJoin);
            exports_1("liveSrv", live_srv_1.liveSrv);
            exports_1("Emitter", emitter_1.Emitter);
            exports_1("layoutSelector", layout_selector_1.layoutSelector);
            exports_1("switchDirective", switch_1.switchDirective);
            exports_1("dashboardSelector", dashboard_selector_1.dashboardSelector);
            exports_1("queryPartEditorDirective", query_part_editor_1.queryPartEditorDirective);
            exports_1("WizardFlow", wizard_1.WizardFlow);
            exports_1("coreModule", core_module_1.default);
            exports_1("appEvents", app_events_1.default);
            exports_1("colors", colors_1.default);
            exports_1("assignModelProperties", model_utils_1.assignModelProperties);
            exports_1("contextSrv", context_srv_1.contextSrv);
            exports_1("KeybindingSrv", keybindingSrv_1.KeybindingSrv);
            exports_1("helpModal", help_1.helpModal);
            exports_1("NavModelSrv", nav_model_srv_1.NavModelSrv);
        }
    };
});
//# sourceMappingURL=core.js.map