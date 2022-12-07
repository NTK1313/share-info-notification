import sys
import matplotlib.pyplot as plt
import requests
from yahoo_finance_api2 import share
from yahoo_finance_api2.exceptions import YahooFinanceError
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP

# 引数（株価情報リスト、取得期間、取得頻度）
def get_share_info_list(info_list,period_day,frequency_day):
	share_list = []
	symbol_data_list = []
	for code in info_list:
		share_info = dict()
		share_info["code"] = code
		share_info["shareCode"] = (share.Share(str(code) + '.T'))
		share_list.append(share_info)
	for info in share_list:
		symbol_data_list.append(get_share_info(info,period_day,frequency_day))
	return symbol_data_list

# 株価情報をYahooファイナンスから取得
# 引数（株価情報、取得期間、取得頻度）
def get_share_info(info,period_day,frequency_day):
	try:
		# print(info)
		symbol_data = info["shareCode"].get_historical(share.PERIOD_TYPE_DAY,
										period_day,
										share.FREQUENCY_TYPE_DAY,
										frequency_day)
		# timestamp：取引日時
		# open：始値
		# high：高値
		# low：底値
		# close：終値
		# volume：出来高

		# print(symbol_data.keys())
		symbol_data["code"] = int(info["code"])
	except YahooFinanceError as e:
		print(e.message)
		sys.exit(1)
	return symbol_data

# グラフデータ設定
# 引数（データリスト、証券コードリスト、データ取得期間）
def create_graph_data(data_list,code_list,data_period):
	for data in data_list:
		i=0
		graph_x = []
		graph_y = []
		time_list = data["timestamp"]
		price_list = data["close"]
		# print(price_list)
		for d in range(len(time_list)-data_period,len(time_list)):
			date = time_list[int(d)]
			time = datetime.utcfromtimestamp(int(date/1000))
			datetime_formatted = time.strftime("%m/%d")
			# print(datetime_formatted)
			price = price_list[int(d)]
			code = code_list[int(i)]
			# print(price)
			if str(price) != 'None':
				# 小数点第2位を四捨五入
				price_str = Decimal(str(price)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
				#price_str = str(math.floor(price))
				# print('取得日時：' + str(time) + ' ' +'株価(JPY)：' + str(price_str))
				graph_x.append(str(datetime_formatted))
				graph_y.append((price_str))
			else:
				print('データ取得エラーのためスキップ')
		plt.plot(graph_x,graph_y,label=code,marker="o")
		i +=1
	graph_x = sorted(graph_x)
	graph_y = sorted(graph_y)

# 折れ線グラフ定義
def line_graph():
	plt.ylim(1500,3500)
	plt.xlabel("日時", fontname="MS Gothic")
	plt.xticks()
	plt.ylabel("株価", fontname="MS Gothic")
	plt.yticks()
	plt.grid(linestyle = '--')
	plt.title("株価推移", fontname="MS Gothic")

# LINE通知
# 引数（通知メッセージ）
def send_line_notify(notification_message,file):
	# LINEアクセストークン
    line_notify_token = 'PgZYKr6HE5OSxgio7gOXYEHFSCEct71dbAAetmP2BVf'
    line_notify_api = 'https://notify-api.line.me/api/notify'
    headers = {'Authorization': f'Bearer {line_notify_token}'}
    data = {'message': f'message: {notification_message}'}
	# 添付ファイル存在チェック
    if len(file) == 0:
        print('file is not exists')
        requests.post(line_notify_api, headers = headers, data = data)
    else:
        print('file is exists')
        files = {'imageFile': file}
        requests.post(line_notify_api, headers = headers, data = data,files=files)