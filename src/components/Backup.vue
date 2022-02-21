<template>
    <div class="w-50 mx-auto my-5 text-right px-4 bg-secondary text-white rounded">
        <h2 class="text-center py-4 border-bottom">النسخ الاحتياطي</h2>
        <div class="row py-4 border-bottom no-gutters">
            <h6 class="col-12">تصدير نسخة احتياطية:</h6>
            <div class="col-8">
                <div class="input-group">
                    <label for="file_name" class="mx-3"> اسم الملف:</label>
                    <input type="text" id="file_name" class="form-control">
                </div>
            </div>
            <div class="col-4 pr-md-5">
                <button class="btn btn-primary">تصدير</button>
            </div>
        </div>

        <div class="row py-4 border-bottom no-gutters">
            <h6 class="col-12">استيراد نسخة احتياطية:</h6>
            <div class="col-8">
                <div class="input-group">
                    <label for="file_name" class="mx-3"> الملف:</label>
                    <input type="text" id="file_name" class="form-control">
                </div>
            </div>
            <div class="col-4 pr-md-5">
                <label for="restore" class="btn btn-primary">استعراض</label>
                <input type="file" id="restore" hidden>
            </div>
            <div class="col-12 text-center mt-3">
                <button class="btn btn-primary">استيراد</button>
            </div>
        </div>
    </div>
</template>