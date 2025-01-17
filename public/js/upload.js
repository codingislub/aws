AWS.config.update({
    accessKeyId: '', // Add your access key
    secretAccessKey: '', // Add your secret key
    region: 'ap-south-1'
});

var s3 = new AWS.S3();
var rekognition = new AWS.Rekognition();
var sns = new AWS.SNS();
var cloudwatch = new AWS.CloudWatch(); // Initialize CloudWatch

function uploadFile() {
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];
    if (!file) {
        alert("Please choose a file to upload first.");
        return;
    }
    var params = {
        Bucket: 'agri-03',
        Key: file.name,
        Body: file,
        ACL: 'public-read',
        region: 'ap-south-1'
    };

    s3.upload(params, function(err, data) {
        if (err) {
            console.error('There was an error uploading your file: ', err);
            alert('There was an error uploading your file.');
            // Send error metric to CloudWatch
            sendCloudWatchMetric('ImageUploadErrors', 1);
            return;
        }
        
        console.log('Successfully uploaded file.', data);
        alert('File successfully uploaded. File URL: ' + data.Location);
        
        // Send success notification and metric to CloudWatch
        sendNotification(file.name);
        sendCloudWatchMetric('ImageUploads', 1);
        analyzeImage(data.Key);
    });
}

function sendNotification(fileName) {
    const params = {
        Message: `A new image has been successfully uploaded: ${fileName}`,
        TopicArn: 'arn:aws:sns:ap-south-1:084375552036:tabs' // Replace with your SNS topic ARN
    };

    sns.publish(params, function(err, data) {
        if (err) {
            console.error("Error sending SNS notification: ", err);
        } else {
            console.log("SNS notification sent successfully: ", data);
        }
    });
}

function sendCloudWatchMetric(metricName, value) {
    const params = {
        MetricData: [
            {
                MetricName: metricName,
                Dimensions: [
                    {
                        Name: 'ServiceName',
                        Value: 'S3Uploads'
                    }
                ],
                Unit: 'Count',
                Value: value
            }
        ],
        Namespace: 'YourAppNamespace' // Change to your desired namespace
    };

    cloudwatch.putMetricData(params, function(err, data) {
        if (err) {
            console.error("Error sending CloudWatch metric: ", err);
        } else {
            console.log("CloudWatch metric sent successfully: ", data);
        }
    });
}

function analyzeImage(fileName) {
    console.log('Analyzing image with the following details:');
    console.log('Bucket: agri-03');
    console.log('FileName: ' + fileName);

    var params = {
        Image: {
            S3Object: {
                Bucket: 'agri-03',
                Name: fileName
            }
        },
        MaxLabels: 10,
        MinConfidence: 75
    };

    rekognition.detectLabels(params, function(err, data) {
        if (err) {
            console.error('Error from Rekognition service: ', err);
            alert('There was an error analyzing the image. ' + err.message);
        } else {
            console.log('Rekognition analysis results: ', data);
            displayResults(data);
        }
    });
}

function displayResults(data) {
    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<h3>Rekognition Analysis Results</h3>';
    data.Labels.forEach(function(label) {
        var labelElement = document.createElement('p');
        labelElement.textContent = `${label.Name}: ${label.Confidence.toFixed(2)}% confidence`;
        resultsContainer.appendChild(labelElement);
    });
}

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    uploadFile();
});

document.getElementById('file').addEventListener('change', function() {
    var fileName = this.files[0].name;
    document.querySelector('.custom-file-label').textContent = fileName;
});
