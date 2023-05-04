const AWS = require('aws-sdk');
const { promisify } = require('util');
const express = require('express');



AWS.config.update({
    accessKeyId: 'AKIA5GYQHAVVX63W45JE',
    secretAccessKey: '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',
    region: 'us-east-1'
});

const Athena = new AWS.Athena();

const startQueryExecution = promisify(Athena.startQueryExecution.bind(Athena));
const getQueryExecution = promisify(Athena.getQueryExecution.bind(Athena));
const getQueryResults = promisify(Athena.getQueryResults.bind(Athena));

async function athenaCovidData(query) {
    try {
        // const query = `SELECT COUNT(confirmed) as confirmedCasesCount FROM thdatabase.th_table`;
        const params = {
            QueryString: query,
            ResultConfiguration: {
                OutputLocation: 's3://destinationproth/Unsaved'
            }
        };

        const data = await startQueryExecution(params);
        const queryExecutionId = data.QueryExecutionId;

        // Wait for the query to finish
        while (true) {
            const queryExecution = await getQueryExecution({ QueryExecutionId: queryExecutionId });
            const queryState = queryExecution.QueryExecution.Status.State;

            if (queryState === 'SUCCEEDED') {
                break;
            } else if (queryState === 'FAILED' || queryState === 'CANCELLED') {
                throw new Error(`Query execution failed or was cancelled. State: ${queryState}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        }

        const getQueryResultsParams = {
            QueryExecutionId: queryExecutionId
        };

        const queryResult = await getQueryResults(getQueryResultsParams);
        const resultSet = queryResult.ResultSet;
        const columnInfo = resultSet.ResultSetMetadata.ColumnInfo;
        const rows = resultSet.Rows;
        const result = [];

        // Convert the results to an array of objects with column names as keys
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const obj = {};

            for (let j = 0; j < row.Data.length; j++) {
                const column = columnInfo[j];
                const value = row.Data[j].VarCharValue;

                obj[column.Name] = value;
            }

            result.push(obj);
        }
        return result;
    } catch (err) {
        throw err;
    }
}

const app = express();

app.get('/covidTracker', async(req, res) => {
    try {
        const searchQuery = req.query.state ? req.query.state.toLowerCase() : '';
        const query = `SELECT sum(confirmed) as confirmedCasesCount, sum(active) as activeCasesCount, sum(recovered) as recoveredCasesCount, sum(deceased) as deceasedCasesCount FROM thdatabase.th_table`;
        const query1 = `SELECT state, SUM(confirmed) AS confirmedCases, sum(active) as activeCases, sum(recovered) as recoveredCases, sum(deceased) as deceasedCases FROM thdatabase.th_table GROUP BY state`;
        const query2 = `SELECT * FROM thdatabase.th_table WHERE LOWER(state) LIKE LOWER('%${searchQuery}%')`;
        const results = await Promise.all([
            athenaCovidData(query),
            athenaCovidData(query1),
            athenaCovidData(query2)
        ]);
        const response = {
            summary: results[0],
            activeCasesForStates: results[1],
            searchResults: results[2]
        };

        // if (resp && resp.length) res.status(200).send(resp);
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(5353, () => {
    console.log('Server is running on port 5353');
});