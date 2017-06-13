///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module", "app/core/app_events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, app_events_1, UtilSrv;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            UtilSrv = (function () {
                /** @ngInject */
                function UtilSrv($rootScope, $modal) {
                    this.$rootScope = $rootScope;
                    this.$modal = $modal;
                }
                UtilSrv.prototype.init = function () {
                    app_events_1.default.on('show-modal', this.showModal.bind(this), this.$rootScope);
                    app_events_1.default.on('hide-modal', this.hideModal.bind(this), this.$rootScope);
                };
                UtilSrv.prototype.hideModal = function () {
                    if (this.modalScope && this.modalScope.dismiss) {
                        this.modalScope.dismiss();
                    }
                };
                UtilSrv.prototype.showModal = function (options) {
                    if (this.modalScope && this.modalScope.dismiss) {
                        this.modalScope.dismiss();
                    }
                    this.modalScope = options.scope;
                    if (options.model) {
                        this.modalScope = this.$rootScope.$new();
                        this.modalScope.model = options.model;
                    }
                    else if (!this.modalScope) {
                        this.modalScope = this.$rootScope.$new();
                    }
                    var modal = this.$modal({
                        modalClass: options.modalClass,
                        template: options.src,
                        templateHtml: options.templateHtml,
                        persist: false,
                        show: false,
                        scope: this.modalScope,
                        keyboard: false,
                        backdrop: options.backdrop
                    });
                    Promise.resolve(modal).then(function (modalEl) {
                        modalEl.modal('show');
                    });
                };
                return UtilSrv;
            }());
            exports_1("UtilSrv", UtilSrv);
            core_module_1.default.service('utilSrv', UtilSrv);
        }
    };
});
//# sourceMappingURL=util_srv.js.map