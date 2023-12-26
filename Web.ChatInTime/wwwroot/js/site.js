function bindPagination(formId) {
    var form = formId == undefined ? $("form") : $("#" + formId);

    var selectedPageSize = form.find("select[name='SelectedPageSize']");
    selectedPageSize.on("change", function () {
        var pageSize = selectedPageSize.val();
        $("input[name='PageSize']").val(pageSize);
        form.submit();
    });

    form.find(".sy-pagination li").each(function () {
        var pageIndex = $(this).children().data("pageindex");
        if (pageIndex != undefined) {
            $(this).on("click", function () {
                $("input[name='PageIndex']").val(pageIndex);
                form.submit();
            });
        }
    });
}